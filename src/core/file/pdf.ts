import {
  getDocument,
  PageViewport,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist";
import { EventBus, TextLayerBuilder } from "pdfjs-dist/web/pdf_viewer";
import { ref } from "vue";
import { setCatalog } from "../book/catalog";
import { StorageBook } from "../type";
import { createEle } from "../utils/utils";
import { Bextname } from "./extname";

const scale = ref<number>(1.7); // 展示比例
export const documentProxyMap = new Map<string, PDFDocumentProxy>();

let container: null | HTMLElement = null;

function getViewport(page: PDFPageProxy) {
  return page.getViewport({
    scale: scale.value, // 展示比例
    rotation: 0, // 旋转角度
  });
}

function createCanvas({ width, height, viewBox }: PageViewport) {
  const canvas = createEle("canvas") as HTMLCanvasElement;
  const canvasContext = canvas.getContext("2d")!;
  canvas.height = height || viewBox[3];
  canvas.width = width || viewBox[2];
  return { canvasContext, canvas };
}

function createWrapper({ width, height }: PageViewport, className: string) {
  const wrapper = createEle("div");
  wrapper.setAttribute("class", className);
  wrapper.setAttribute("style", `width: ${width}px; height: ${height}px`);
  return wrapper;
}

export function loadPdf({ fileContent, id }: StorageBook) {
  return getDocument(fileContent).promise.then(async (pdf) => {
    container = document.getElementById("viewer");

    documentProxyMap.set(id, pdf);
    // 获取目录
    await setCatalog(id, { extname: Bextname.pdf, documentProxy: pdf });

    for (let i = 1; i < 20; i++) {
      try {
        await rendPDF(pdf, i);
      } catch (e) {
        console.error(e);
      }
    }
  });
}

/**
 * 为了 减少 实现 pdf复制文本的功能 的工作量
 * 采用 复用官方提供模板，其模板如下：
*   <div id="viewerContainer" tabindex="0">
      <div id="viewer" class="pdfViewer">
        <div class="page" style="width: 1060px; height: 1372px;">
          <div class="canvasWrapper" style="width: 1060px; height: 1372px;">
            <!-- canvas图层 -->
            <canvas role="presentation" width="1061" height="1373" style="width: 1061px; height: 1373px;"></canvas>
          </div>
          <div class="textLayer" style="width: 1060px; height: 1372px;">
            <!-- 文本图层 -->
          </div>
        </div>
      </div>
    </div>
 * @param pdf 
 * @param num 
 */
export async function rendPDF(pdf: PDFDocumentProxy, num: number) {
  const page = await pdf.getPage(num);
  const viewport = getViewport(page);
  const { canvasContext, canvas } = createCanvas(viewport);
  await page.render({ canvasContext, viewport });

  const pageWrapper = createWrapper(viewport, "page");
  const canvasWrapper = createWrapper(viewport, "canvasWrapper");
  canvasWrapper.appendChild(canvas);
  pageWrapper.appendChild(canvasWrapper);

  const textContent = await page.getTextContent();

  const textLayerWrapper = createWrapper(viewport, "textLayer");

  pageWrapper.appendChild(textLayerWrapper);
  container!.appendChild(pageWrapper);

  const textLayer = new TextLayerBuilder({
    eventBus: new EventBus(),
    textLayerDiv: textLayerWrapper,
    pageIndex: page.pageNumber,
    viewport,
  });

  textLayer.setTextContent(textContent);
  textLayer.render();
}

export function getPDFCover(fileContent: Uint8Array): Promise<string> {
  return new Promise<string>((resolve) => {
    getDocument(fileContent)
      .promise.then((pdfDoc) => {
        return pdfDoc.getPage(1);
      })
      .then((page) => {
        const viewport = getViewport(page);
        const { canvasContext, canvas } = createCanvas(viewport);
        const task = page.render({ canvasContext, viewport });
        task.promise.then(async () => {
          const cover = canvas.toDataURL("image/jpeg");
          resolve(cover);
        });
      })
      .catch((err: any) => {
        resolve("");
      });
  });
}

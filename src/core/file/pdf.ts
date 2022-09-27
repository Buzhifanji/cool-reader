import {
  getDocument,
  PageViewport,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist";
import {
  EventBus,
  GenericL10n,
  PDFLinkService,
  PDFViewer,
  TextLayerBuilder,
} from "pdfjs-dist/web/pdf_viewer";
import { ref } from "vue";
import { setCatalog } from "../book/catalog";
import { setPdfDocument } from "../store";
import { setPDfPagesHeight } from "../store/pdf";
import { StorageBook } from "../type";
import { createEle, getEleById } from "../utils/utils";
import { Bextname } from "./extname";

const scale = ref<number>(1.7); // 展示比例

let container: null | HTMLElement = null;

export function getViewport(page: PDFPageProxy) {
  const devicePixelRatio = window.devicePixelRatio; // 提高清晰度
  return page.getViewport({
    scale: scale.value * devicePixelRatio, // 展示比例
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
    container = getEleById("viewer");
    // 获取目录
    await setCatalog(id, { extname: Bextname.pdf, documentProxy: pdf });
    setPdfDocument(id, { document: pdf, heights: new Map() });
    const fragment = await createPageContainer(pdf, id);
    container?.appendChild(fragment);
    renderPages(1, pdf);
  });
}

export async function getPdf({ fileContent, id }: StorageBook) {
  const container = getEleById("viewerContainer")! as HTMLDivElement;
  const pdfLinkService = new PDFLinkService({
    eventBus: new EventBus(),
  });
  const l10n = new GenericL10n("zh");
  // const pdfRenderingQueue = new PDFRenderingQueue();
  let pdfViewer = new PDFViewer({
    container: container,
    eventBus: new EventBus(),
    linkService: pdfLinkService,
    l10n,
  });
  pdfViewer.currentScale = 2 * window.devicePixelRatio;
  const loadingTask = getDocument(fileContent);
  const pdf = await loadingTask.promise;

  setCatalog(id, { extname: Bextname.pdf, documentProxy: pdf });

  pdfViewer.setDocument(pdf);
}

async function createPageContainer(pdf: PDFDocumentProxy, id: string) {
  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= pdf.numPages; i++) {
    const pageDocument = await pdf.getPage(i);
    const { height } = getViewport(pageDocument);
    setPDfPagesHeight(id, i, height);
    const page = createEle("div");
    page.appendChild(createLoading());
    page.setAttribute("class", "page");
    page.setAttribute("page-number", i.toString());
    page.setAttribute("style", `height: ${height}px;`);
    fragment.appendChild(page);
  }
  return fragment;
}

export async function renderCanvas(page: PDFPageProxy) {
  const viewport = getViewport(page);
  const { canvasContext, canvas } = createCanvas(viewport);
  await page.render({ canvasContext, viewport });
  const canvasWrapper = createWrapper(viewport, "canvasWrapper");
  canvasWrapper.appendChild(canvas);
  return Promise.resolve(canvasWrapper);
}

export async function renderTextLayer(page: PDFPageProxy) {
  const viewport = getViewport(page);
  const textContent = await page.getTextContent();
  const textLayerWrapper = createWrapper(viewport, "textLayer");
  const textLayer = new TextLayerBuilder({
    eventBus: new EventBus(),
    textLayerDiv: textLayerWrapper,
    pageIndex: page.pageNumber,
    viewport,
  });
  textLayer.setTextContent(textContent);
  textLayer.render();
  return Promise.resolve(textLayerWrapper);
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

function getPageNo(start: number, end: number) {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

/**
 * 当文件有上百页面时候，全部渲染成DOM,需要很大的内存。
 * 为了不浪费内存，并且防止页面卡顿，只保留 9 页渲染数据
 */
export function getRenderScope(pageIndex: number, totalPage: number) {
  const MAX = 9;
  // 总页数 小于等于 9 页
  if (totalPage <= MAX) {
    return getPageNo(1, totalPage);
  } else if (pageIndex >= totalPage) {
    return getPageNo(totalPage - MAX + 1, totalPage);
  } else if (totalPage <= MAX + pageIndex) {
    // 显示 最后 9 页其中一页
    return getPageNo(totalPage - MAX + 1, totalPage);
  } else {
    const temp = pageIndex - Math.floor(MAX / 2);
    const start = temp <= 1 ? 1 : temp;
    const end = start + MAX - 1;
    return getPageNo(start, end);
  }
}

export function renderPages(pageIndex: number, pdf: PDFDocumentProxy) {
  const totalPage = pdf.numPages;
  const pagesToRender = getRenderScope(pageIndex, totalPage);
  for (let index = 1; index <= pdf.numPages; index++) {
    if (pagesToRender.includes(index)) {
      renderPageContent(index, pdf);
    } else {
      clearPage(index);
    }
  }
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
 */
async function renderPageContent(pageIndex: number, pdf: PDFDocumentProxy) {
  if (!isExitPage(pageIndex)) {
    const pageWrapper = getPageNoElem(pageIndex);
    pageWrapper.appendChild(createLoading());
    const page = await pdf.getPage(pageIndex);
    const canvasWrapper = await renderCanvas(page);
    const textLayerWrapper = await renderTextLayer(page);
    removeChildren(pageIndex);
    pageWrapper.appendChild(canvasWrapper);
    pageWrapper.appendChild(textLayerWrapper);
  }
}

function createLoading() {
  const loading = createEle("div");
  loading.setAttribute("class", "tauri-loading");
  return loading;
}

function isExitPage(pageIndex: number) {
  const elem = getPageNoElem(pageIndex);
  if (elem && elem.childNodes.length > 1) {
    return true;
  } else {
    return false;
  }
}

function getPageNoElem(pageIndex: number) {
  return container!.childNodes[pageIndex - 1];
}

function clearPage(pageIndex: number) {
  if (isExitPage(pageIndex)) {
    removeChildren(pageIndex);
  }
}

function removeChildren(pageIndex: number) {
  const elem = getPageNoElem(pageIndex);
  while (elem && elem.hasChildNodes()) {
    elem.removeChild(elem.firstChild!);
  }
}

export function formatePdfCatalog(list: any[]) {
  // 处理 没有目录的特殊情况
  if (list.length === 1 && list[0].title === "目录") {
    return [];
  }

  // 处理没有 子数据的时候 不显示图标的情况
  const handle = (arr: any[]) => {
    arr.forEach((item) => {
      const items = item.items;
      if (items && items.length) {
        handle(items);
      } else {
        delete item.items;
      }
    });
  };
  handle(list);
  return list;
}

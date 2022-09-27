import { getDocument, PageViewport, PDFPageProxy } from "pdfjs-dist";
import {
  EventBus,
  GenericL10n,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer";
import { ref } from "vue";
import { setCatalog } from "../book/catalog";
import { setPDfPagesHeight } from "../store/pdf";
import { StorageBook } from "../type";
import { createEle, getEleById } from "../utils/utils";
import { Bextname } from "./extname";

const scale = ref<number>(1.7); // 展示比例

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

export async function getPdf({ fileContent, id }: StorageBook) {
  const container = getEleById("viewerContainer")! as HTMLDivElement;
  const pdfLinkService = new PDFLinkService({
    eventBus: new EventBus(),
  });
  setPDfPagesHeight;
  const l10n = new GenericL10n("zh");
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

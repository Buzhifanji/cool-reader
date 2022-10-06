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
} from "pdfjs-dist/web/pdf_viewer";
import { toRaw } from "vue";
import { StorageBook } from "../type";
import {
  arrayHasData,
  createEle,
  getEleById,
  isArray,
  isObj,
  isOwn,
} from "../utils/utils";

const scale = 1.75 * window.devicePixelRatio; // 展示比例

/**
 * 缓存 pdf 数据信息
 */

let pdfViewer: PDFViewer | null = null;
let PDFDocumentProxy: PDFDocumentProxy | null = null;
let catalogs: any[] = []; // 目录

export function getViewport(page: PDFPageProxy) {
  return page.getViewport({
    scale, // 展示比例
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

export async function renderPdf({ fileContent, id }: StorageBook) {
  const container = getEleById("viewerContainer")! as HTMLDivElement;

  const pdfLinkService = new PDFLinkService({
    eventBus: new EventBus(),
  });

  pdfViewer = new PDFViewer({
    container: container,
    eventBus: new EventBus(),
    linkService: pdfLinkService,
    l10n: new GenericL10n("zh"),
  });
  pdfViewer._setScale(scale);
  const loadingTask = getDocument(fileContent);
  PDFDocumentProxy = await loadingTask.promise;

  const outline = await PDFDocumentProxy.getOutline();
  catalogs = formatePdfCatalog(outline);
  pdfViewer.eventBus.on("pagechanging", (value: any) => {
    console.log("pagechanging", value);
    console.log(pdfViewer!.currentPageNumber);
  });

  pdfViewer.setDocument(PDFDocumentProxy);
  return pdfViewer;
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

/**
 * 获取 pdf 目录
 * @param bookId
 * @returns
 */
export function getPdfCatalogs() {
  return catalogs;
}

export async function pdfGotoPage(desc: any) {
  if (isArray(desc) && arrayHasData(desc)) {
    const refProxy = toRaw(desc[0]);
    if (isObj(refProxy) && isOwn(refProxy, "num") && isOwn(refProxy, "gen")) {
      const pageNumber = await PDFDocumentProxy!.getPageIndex(refProxy);
      pdfJumpToPage(pageNumber);
    }
  }
}

export function pdfJumpToPage(pageNumber: number) {
  pdfViewer!.scrollPageIntoView({ pageNumber });
}

export function pdfPageUp() {
  pdfViewer?.previousPage();
}

export function pdfPageDown() {
  pdfViewer?.nextPage();
}

function formatePdfCatalog(list: any[]) {
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

import { VIEWERCONTAINER } from "src/constants";
import { updatePageNumber, updateReadingBook } from "src/store";
import {
  arrayHasData,
  createEle,
  formateCatalog,
  getEleById,
  isArray,
  isObj,
  isOwn,
} from "src/utils";
import { getDocument, PageViewport, PDFPageProxy } from "pdfjs-dist";
import {
  EventBus,
  GenericL10n,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer";

const scale = 1.75 * window.devicePixelRatio; // 展示比例

/**
 * 缓存 pdf 数据信息
 */

let pdfViewer: PDFViewer | null = null;

function getViewport(page: PDFPageProxy) {
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

export async function renderPdf(content: Uint8Array) {
  const container = getEleById(VIEWERCONTAINER)! as HTMLDivElement;

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
  const loadingTask = getDocument(content);
  const pdfDocument = await loadingTask.promise;

  const outline = await pdfDocument.getOutline();

  const catalog = formatePdfCatalog(outline);

  pdfViewer.setDocument(pdfDocument);

  updateReadingBook({ catalog });

  pdfViewer.eventBus.on("textlayerrendered", pageNumberChange);

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

export const usePdfChangePage = () => {
  async function pdfJumpFromCatalog(desc: any) {
    if (isArray(desc) && arrayHasData(desc)) {
      const refProxy = toRaw(desc[0]);
      if (isObj(refProxy) && isOwn(refProxy, "num") && isOwn(refProxy, "gen")) {
        const pageNumber = await pdfViewer?.pdfDocument!.getPageIndex(refProxy);
        pdfJumpToPage(pageNumber!);
      }
    }
  }
  function pdfJumpToPage(pageNumber: number) {
    pdfViewer?.scrollPageIntoView({ pageNumber });
  }

  function pdfPageUp() {
    pdfViewer?.previousPage();
  }

  function pdfPageDown() {
    pdfViewer?.nextPage();
  }

  return { pdfJumpFromCatalog, pdfPageUp, pdfJumpToPage, pdfPageDown };
};

function pageNumberChange() {
  updatePageNumber(pdfViewer!.currentPageNumber);
}

export function getPdfCurrentPageNumber() {
  return pdfViewer?._currentPageNumber;
}

export function removePdfEvent() {
  // pdfViewer?.eventBus?.on("textlayerrendered", pageNumberChange);
}

function formatePdfCatalog(list: any[]) {
  // 处理 没有目录的特殊情况
  if (list.length === 1 && list[0].title === "目录") {
    return [];
  }

  // 处理没有 子数据的时候 不显示图标的情况
  formateCatalog(list, "items");
  return list;
}

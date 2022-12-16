import { VIEWERCONTAINER } from "src/constants";
import { updatePageNumber, updateReadingBook } from "src/store";
import {
  arrayHasData,
  createEle,
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
import { jumpToRecordPosition } from "../scroll";

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
  const canvas = createEle("canvas");
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
  // 跳转到上次阅读的位置
  pdfViewer.eventBus.on("pagesloaded", jumpToRecordPosition);

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

export async function getPdfPageNumber(desc: any) {
  if (isArray(desc) && arrayHasData(desc)) {
    const refProxy = toRaw(desc[0]);
    const pageNumber = await pdfViewer?.pdfDocument!.getPageIndex(refProxy)!;
    return pageNumber
  } else {
    return 0
  }
}

export const usePdfChangePage = () => {
  async function pdfJumpFromCatalog(desc: any) {
    const pageNumber = await getPdfPageNumber(desc)
    return pdfJumpToPage(pageNumber);
  }
  function pdfJumpToPage(pageNumber: number) {
    return pdfViewer?.scrollPageIntoView({ pageNumber });
  }

  function pdfPageUp() {
    return pdfViewer?.previousPage();
  }

  function pdfPageDown() {
    return pdfViewer?.nextPage();
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

  return list;
}

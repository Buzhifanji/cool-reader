import { VIEWERCONTAINER } from "src/constants";
import { updatePageNumber, updateReadingBook } from "src/store";
import {
  createEle,
  getEleById,
  isArray,
  isObj,
  isStr,
} from "src/utils";
import { getDocument, PageViewport, PDFPageProxy } from "pdfjs-dist";
import {
  EventBus,
  GenericL10n,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer";
import { jumpToRecordPosition } from "../scroll";
import { RefProxy } from "pdfjs-dist/types/src/display/api";

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

  pdfLinkService.setViewer(pdfViewer);

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

export async function getPdfPageNumber(destRef: unknown) {
  if (isObj(destRef)) {
    const pageNumber = await pdfViewer?.pdfDocument!.getPageIndex(destRef as RefProxy)!;
    return pageNumber + 1;
  } else if (Number.isInteger(destRef)) {
    return (destRef as number) + 1;
  } else {
    console.log(` "${destRef}" is not ` + `a valid destination reference`)
    return -1
  }
}

async function goToDestination(dest: any) {
  let explicitDest = dest;
  if (isStr(dest)) {
    explicitDest = await pdfViewer!.pdfDocument!.getDestination(dest)
  }

  if (!isArray(explicitDest)) {
    console.error(`PDFLinkService.goToDestination: "${explicitDest}" is not ` + `a valid destination array, for dest="${dest}".`)
    return
  }

  return goToDestinationHelper(dest, explicitDest)

}

async function goToDestinationHelper(dest: any, explicitDest: any) {
  const destRef = explicitDest[0];
  const pageNumber = await getPdfPageNumber(destRef)
  const pagCount = pdfViewer!.pagesCount
  console.log(pagCount)
  if (pageNumber < 1 || pageNumber > pagCount) {
    console.error(`PDFLinkService.#goToDestinationHelper: "${pageNumber}" is not ` + `a valid page number, for dest="${dest}".`);
    return
  }

  return pdfViewer!.scrollPageIntoView({ pageNumber, destArray: explicitDest, ignoreDestinationZoom: true });
}

export const usePdfChangePage = () => {
  async function pdfJumpFromCatalog(dest: any) {
    return goToDestination(dest)
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


export async function getPdfCurrentPageRef() {
  const pageNum = getPdfCurrentCurrentPageNumber();
  const res = await pdfViewer!.pdfDocument!.getPage(pageNum)
  return res.ref
}

export function getPdfCurrentCurrentPageNumber() {
  return pdfViewer!._currentPageNumber;
}
import { VIEWERCONTAINER } from "src/constants";
import { updateReadingBook } from "src/store";
import {
  createEle,
  getEleById,
  getPDFPageSelector,
  isArray,
  isObj,
  isStr,
  selector,
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

  return await goToDestinationHelper(dest, explicitDest)

}

function goToDestinationHelper(dest: any, explicitDest: any) {
  return new Promise(async (resolve, reject) => {
    const destRef = explicitDest[0];
    const pageNumber = await getPdfPageNumber(destRef)
    const pagCount = pdfViewer!.pagesCount
    if (pageNumber < 1 || pageNumber > pagCount) {
      console.error(`PDFLinkService.#goToDestinationHelper: "${pageNumber}" is not ` + `a valid page number, for dest="${dest}".`);
      return
    }

    pdfViewer!.scrollPageIntoView({ pageNumber, destArray: explicitDest, ignoreDestinationZoom: true });

    // 尝试获取dom节点，如何能够获取到，说明已经渲染完成了。
    const selctor = getPDFPageSelector(pageNumber);
    const dom = selector(selctor);
    if (dom) {
      resolve('loaded')
    }

    // 没有渲染过，则监听页面 加载完成
    pdfViewer!.eventBus.on("textlayerrendered", (value: any) => {
      if (value.pageNumber === pageNumber) {
        resolve('loaded')
      }
    });
  })
}

export const usePdfChangePage = () => {
  async function pdfJumpFromCatalog(dest: any) {
    return await goToDestination(dest)
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


async function getPdfCurrentPageRef() {
  const pageNum = getPdfCurrentCurrentPageNumber();
  const res = await pdfViewer!.pdfDocument!.getPage(pageNum)
  return res.ref
}

function getPdfBoundingRect(x: number, y: number) {
  const pageNum = getPdfCurrentCurrentPageNumber();
  const pageView = pdfViewer!._pages![pageNum - 1];
  return pageView.viewport.convertToViewportPoint(x, y)
}

export function getPdfCurrentCurrentPageNumber() {
  return pdfViewer!.currentPageNumber;
}


function findCurrentTatalog({ num, gen }: RefProxy, catalog: any[]) {
  const stack: any[] = [];
  const add = (list: any[]) => {
    for (let i = list.length - 1; i >= 0; i--) {
      stack.push(list[i])
    }
  }
  add(catalog)

  let result = [];
  let current;
  while (current = stack.pop()) {
    const target = current.dest[0];
    if (target.num === num && target.gen === gen) {
      result.push(current)
    }
    add(current.items)
  }

  return result
}

function getElementOffset(range: Range) {
  const target = range.startContainer.parentElement!;
  return target.offsetTop
}
function getTitleByRefRroxy(refProxyes: any[], offsetTop: number) {
  const len = refProxyes.length;
  let title = ''
  if (len === 1) {
    title = refProxyes[0].title
  } else if (len > 1) {
    title = findeTitleByRefProxyes(refProxyes, offsetTop)
  }
  return title
}
function findeTitleByRefProxyes(refProxyes: any, offsetTop: number) {
  let result = '';
  for (let i = 0; i < refProxyes.length; i++) {
    const dest = refProxyes[i].dest
    const x = dest[2]
    const y = dest[3]
    const [, top] = getPdfBoundingRect(x, y);
    // 此处是关键：可能存在bug，这里 依据
    // node_modules/.pnpm/pdfjs-dist@2.16.105/node_modules/pdfjs-dist/lib/web/base_viewer.js
    // 的 scrollPageIntoView 方法，逆向推算出来的
    if (offsetTop >= top) {
      result = refProxyes[i].title;
      break
    }
  }
  return result
}
// 这里巨坑,根据点击的位置，查找菜单对应的目录 的标题（标题为id，确定每一个菜单）
export async function getPdfTitle(range: Range, catalog: any[]) {
  const refProxy = await getPdfCurrentPageRef();
  if (!refProxy) return;

  const refProxyes = findCurrentTatalog(refProxy, catalog)
  const offsetTop = getElementOffset(range);
  return getTitleByRefRroxy(refProxyes, offsetTop)
}
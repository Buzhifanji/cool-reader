import { VIEWERCONTAINER } from "src/constants";
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
import { BookBase } from "./base";
import { todo } from "src/utils/todo";

const scale = 1.75 * window.devicePixelRatio; // 展示比例

class Pdf extends BookBase {
  rendition: PDFViewer | null = null;

  async render(content: Uint8Array) {
    const container = getEleById(VIEWERCONTAINER)! as HTMLDivElement;

    const pdfLinkService = new PDFLinkService({
      eventBus: new EventBus(),
    });

    const view = new PDFViewer({
      container: container,
      eventBus: new EventBus(),
      linkService: pdfLinkService,
      l10n: new GenericL10n("zh"),
    });

    pdfLinkService.setViewer(view);

    view._setScale(scale);
    const loadingTask = getDocument(content);
    const pdfDocument = await loadingTask.promise;

    const outline = await pdfDocument.getOutline();

    const catalog = formatePdfCatalog(outline);

    view.setDocument(pdfDocument);

    // 跳转到上次阅读的位置
    view.eventBus.on("pagesloaded", jumpToRecordPosition);

    this.rendition = view;

    return catalog;
  }

  up() {
    this.isRender()

    return this.rendition!.previousPage();
  }

  down() {
    this.isRender()

    return this.rendition!.nextPage();
  }

  catalogJump(dest: any) {
    return new Promise(async (resolve, reject) => {

      this.isRender()

      const rendition = this.rendition!

      let explicitDest = dest;
      if (isStr(dest)) {
        explicitDest = await rendition.pdfDocument!.getDestination(dest)
      }

      if (!isArray(explicitDest)) {
        console.error(`PDFLinkService.goToDestination: "${explicitDest}" is not ` + `a valid destination array, for dest="${dest}".`)
        return
      }

      const destRef = explicitDest[0];
      const pageNumber = await this.getPdfPageNumberByRef(destRef)
      if (pageNumber < 1 || pageNumber > rendition.pagesCount) {
        console.error(`PDFLinkService.#goToDestinationHelper: "${pageNumber}" is not ` + `a valid page number, for dest="${dest}".`);
        return
      }

      rendition.scrollPageIntoView({ pageNumber, destArray: explicitDest, ignoreDestinationZoom: true });

      // 尝试获取dom节点，如何能够获取到，说明已经渲染完成了。
      const selctor = getPDFPageSelector(pageNumber);
      const dom = selector(selctor);
      if (dom) {
        resolve('loaded')
      }

      // 没有渲染过，则监听页面 加载完成
      rendition.eventBus.on("textlayerrendered", (value: any) => {
        if (value.pageNumber === pageNumber) {
          resolve('loaded')
        }
      });
    })

  }

  pageJump(num: number) {
    todo('pdf page number jump')
  }

  getCurrentPageNumber() {
    this.isRender()

    return this.rendition!.currentPageNumber;
  }
  async getPdfPageNumberByRef(destRef: unknown) {
    this.isRender()

    if (isObj(destRef)) {
      const pageNumber = await this.rendition!.pdfDocument!.getPageIndex(destRef as RefProxy)!;
      return pageNumber + 1;
    } else if (Number.isInteger(destRef)) {
      return (destRef as number) + 1;
    } else {
      console.log(` "${destRef}" is not ` + `a valid destination reference`)
      return -1
    }
  }

  // 这里巨坑,根据点击的位置，查找菜单对应的目录 的标题（标题为id，确定每一个菜单）
  async getTitle(range: Range, catalog: any[]) {
    this.isRender()

    const rendition = this.rendition!
    const pageNum = this.getCurrentPageNumber();

    const pageRef = await rendition.pdfDocument!.getPage(pageNum)
    const refProxy = pageRef.ref;
    if (!refProxy) return;

    const refProxyes = this.findCurrentTatalog(refProxy, catalog)

    const { offsetTop } = range.startContainer.parentElement!;

    return this.getTitleByRefRroxy(refProxyes, offsetTop)
  }

  private findCurrentTatalog({ num, gen }: RefProxy, catalog: any[]) {
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
  private getTitleByRefRroxy(refProxyes: any[], offsetTop: number) {
    const len = refProxyes.length;
    let title = ''
    if (len === 1) {
      title = refProxyes[0].title
    } else if (len > 1) {
      title = this.findeTitleByRefProxyes(refProxyes, offsetTop)
    }
    return title
  }
  private findeTitleByRefProxyes(refProxyes: any, offsetTop: number) {
    let result = '';
    for (let i = 0; i < refProxyes.length; i++) {
      const dest = refProxyes[i].dest
      const x = dest[2]
      const y = dest[3]
      const [, top] = this.getPdfBoundingRect(x, y);
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
  private getPdfBoundingRect(x: number, y: number) {
    const pageNum = this.getCurrentPageNumber();
    const pageView = this.rendition!._pages![pageNum - 1];
    return pageView.viewport.convertToViewportPoint(x, y)
  }
}

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

function formatePdfCatalog(list: any[]) {
  // 处理 没有目录的特殊情况
  if (list.length === 1 && list[0].title === "目录") {
    return [];
  }
  return list;
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

export const pdf = new Pdf();
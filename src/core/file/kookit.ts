import { VIEWER, VIEWERCONTAINER } from "src/constants";
import { KookitChapter, KookitRenderParams } from "src/interfaces";
import { updateReadingBook } from "src/store";
import { getEleById } from "src/utils";
import { addIframeDeaultCss, getCustomCss, setViewerStlye } from "../style";

declare var window: any;

// 整合目录
function formateCatalog(catalogs: KookitChapter[]) {
  const result: KookitChapter[] = [];
  let isSameChapters: boolean = false;

  catalogs.forEach(catalog => {
    const { label } = catalog;
    const isStart = (val: string) => label.startsWith(val)
    if ((isStart("第") || isStart("Chapter") || isStart("CHAPTER"))) {
      result.push(catalog)
      isSameChapters = true;
    } else {
      if (isSameChapters) {
        const lastItem = result[result.length - 1]
        lastItem.subitems.push(catalog)
      } else {
        isSameChapters = false
        result.push(catalog)
      }
    }
  })

  return result
}

// 回到顶部
function scrollToTop() {
  const contianer = getEleById(VIEWERCONTAINER)!;
  contianer.scrollTo(0, 0)
}


export class KookitRender {
  rendition: any = null;
  constructor({ content, renderName, renderMode, isSliding }: KookitRenderParams) {
    const mode = renderMode ? renderMode : 'scroll';
    const isSl = isSliding ? isSliding : false;
    const render = window.Kookit[renderName];
    this.rendition = new render(content.buffer, mode, isSl);
  }
  async action() {
    const rendition = this.rendition;

    const container = getEleById(VIEWER)!
    await rendition.renderTo(container)

    // 目录
    const chapters = await rendition.getChapter();
    const catalog = formateCatalog(chapters)
    updateReadingBook({ catalog });

    // 给渲染容器设置样式
    setViewerStlye()
    // iframe 设置默认样式
    addIframeDeaultCss()
    // 用户可以自行调节的样式
    const customCss = getCustomCss()
    rendition.setStyle(customCss)

    rendition.on('rendered', async () => {
      const position = await rendition.getPosition()
    })
  }
  jump(href: string) {
    this.rendition.goToChapter(href);
    scrollToTop()
  }
  prev() {
    this.rendition.prev();
    scrollToTop()
  }
  next() {
    this.rendition.next();
    scrollToTop()
  }
}
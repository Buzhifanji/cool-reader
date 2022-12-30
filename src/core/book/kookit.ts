import { VIEWER, VIEWERCONTAINER } from "src/constants";
import { getEleById } from "src/utils";
import { addIframeDeaultCss, getCustomCss, setViewerStlye } from "../style";

declare var window: any;

interface KookitRenderParams {
  content: Uint8Array;
  renderName: string;
  renderMode?: string;
  isSliding?: boolean;
  charset?: string;
}

interface KookitChapter {
  label: string;
  id: string;
  href: string;
  subitems: KookitChapter[],
}

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
  context: any = null;
  constructor({ content, renderName, renderMode, isSliding, charset }: KookitRenderParams) {
    const mode = renderMode ? renderMode : 'scroll';
    const isSl = isSliding ? isSliding : false;
    const render = window.Kookit[renderName];
    const params = charset ? [content.buffer, mode, charset, isSl] : [content.buffer, mode, isSl]
    this.context = new render(...params);
  }
  async action() {
    const context = this.context;

    const container = getEleById(VIEWER)!
    await this.context.renderTo(container)

    // 目录
    const chapters = await this.context.getChapter();
    const catalog = formateCatalog(chapters)

    // 给渲染容器设置样式
    setViewerStlye()
    // iframe 设置默认样式
    addIframeDeaultCss()
    // 用户可以自行调节的样式
    const customCss = getCustomCss()
    this.context.setStyle(customCss)

    this.context.on('rendered', async () => {
      const position = await context.getPosition()
    })

    return catalog
  }
  jump(href: string) {
    scrollToTop()

    return this.context.goToChapter(href);
  }
  prev() {
    scrollToTop()

    return this.context.prev();
  }
  next() {
    scrollToTop()

    return this.context.next();
  }
}
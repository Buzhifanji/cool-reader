import { VIEWER, VIEWERCONTAINER } from "src/constants";
import { getEleById, urlToBase64 } from "src/utils";
import epubjs, { Rendition, Location } from "epubjs";
import { lighlighClickBus, lighlightBus } from "../bus";
import { BookBase } from "./base";
import { todo } from "src/utils/todo";

export function getEpubCover(content: Uint8Array): Promise<string> {
  return new Promise((resolve, reject) => {
    const book = epubjs(content.buffer);
    book
      .coverUrl()
      .then((value) => {
        if (value) {
          resolve(urlToBase64(value))
        } else {
          resolve('')
        }
      })
      .catch((err) => {
        resolve("");
      });
  });
}


class Epub extends BookBase {
  rendition: Rendition | null = null

  render(content: Uint8Array): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const book = epubjs(content.buffer);

      const rendition = book.renderTo(VIEWER, {
        flow: "scrolled",
        width: "793px",
        // height: "100%",
        allowScriptedContent: true,
        // view: InlineView
      });
      rendition.themes.fontSize(24 + "px");

      // 选中文本
      rendition.on('selected', (cfiRange: string) => {
        const range = rendition!.getRange(cfiRange)
        const container = getEleById(VIEWERCONTAINER)! as HTMLDivElement;
        const scrollTop = container.scrollTop;

        lighlightBus.emit({ range, scrollTop })
      })

      // 样式表
      rendition.themes.register("dark", "src/style/web-highlight.css");
      rendition.themes.select("dark");

      // 点击
      rendition.on('click', (e: Event) => {
        const target = e.target as HTMLElement;
        lighlighClickBus.emit(target)
      })

      rendition.on('relocated', (location: Location) => {
        // updatePageNumber(location.start.href)
      })

      book.ready.then(() => {
        // 目录
        const catalog = book.navigation.toc;
        resolve(catalog)
      });

      this.rendition = rendition;
    });
  }

  up() {
    this.isRender()

    return this.rendition!.prev();
  }

  down() {
    this.isRender()

    return this.rendition!.next();
  }

  catalogJump(value: any) {
    this.isRender()

    return this.rendition!.display(value);
  }

  pageJump(num: number) {
    todo('epub page jump')
  }
}

export const epub = new Epub();
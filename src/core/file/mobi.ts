import { VIEWER } from "src/constants";
import { MobiChapter } from "src/interfaces";
import { updateReadingBook } from "src/store";
import { formateCatalog, getEleById } from "src/utils";

declare var window: any;

let rendition: any = null;

export async function renderMobi(content: Uint8Array) {
  const { MobiRender } = window.Kookit;
  rendition = new MobiRender(content.buffer, 'scroll', true);

  const container = getEleById(VIEWER)!
  await rendition.renderTo(container)

  console.log(rendition)

  // 目录
  const chapters = await rendition.getChapter();
  const catalog = mobiCatalog(chapters)
  formateCatalog(catalog, "subitems");
  updateReadingBook({ catalog });

  // 样式
  rendition.setStyle('width: 800px; margin: 0 auto;font-family: Inter, Avenir, Helvetica, Arial, sans-serif; font-size: 18px; line-height:28px;')

  rendition.on('rendered', async () => {
    const position = await rendition.getPosition()
    console.log(position)
  })
}

// 整合目录
function mobiCatalog(catalogs: MobiChapter[]) {
  const result: MobiChapter[] = [];
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

export function getMobiCover() {
  console.log('todo: getEpubCover')
}

export function useMobiChangePage() {
  function mobiJumpFromCatalog(href: string) {
    rendition?.goToChapter(href);
  }
  function mobiPageUp() {
    rendition?.prev();
  }
  function mobiPageDown() {
    rendition?.next();
  }

  return { mobiJumpFromCatalog, mobiPageUp, mobiPageDown }
}

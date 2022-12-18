import { debounceFilter } from "@vueuse/core";
import { RefProxy } from "pdfjs-dist/types/src/display/api";
import { VIEWERCONTAINER } from "src/constants";
import { lighlighClickBus, lighlightBus } from "src/core/bus";
import { getPdfCurrentCurrentPageNumber, getPdfCurrentPageRef } from "src/core/file";
import { DomSource, EventType, isHeightWrap, WebHighlight } from "src/core/web-highlight";
import { DATA_WEB_HIGHLIGHT } from "src/core/web-highlight/constant";
import { Bookextname } from "src/enums";
import { getReadingBook } from "src/store";
import { useToolbarStore } from "src/store/toolbar";
import { concatRectDom, getEleById, getIframe, getIframeDoc, getPDFPageSelector, selector } from "src/utils";
import { getCurrentBookCatalog } from "src/utils/book";

const webHighlight = new WebHighlight({});
const readingBook = getReadingBook();

async function getPdfRoot() {
  // const chapter = getCurrentBookCatalog();
  const pageNumber = getPdfCurrentCurrentPageNumber()
  console.log('pageNumber', pageNumber)
  const selctor = getPDFPageSelector(pageNumber);
  return selector(selctor);
}

async function getBookRoot() {
  switch (readingBook.extname) {
    case Bookextname.pdf:
      return await getPdfRoot();
    case Bookextname.epub:
      return getIframeDoc()
    default:
      return document;
  }
}

function handleBookHighlight() {
  switch (readingBook.extname) {
    case Bookextname.pdf:
    case Bookextname.epub:
    default:
  }
}

function setToolBarStle({ top, left, height }: DOMRect) {
  const { scrollTop, scrollLeft } = getEleById(VIEWERCONTAINER)!;
  const _top = (top + scrollTop - height - 96) + 'px';
  const _left = (left + scrollLeft) + 'px'

  return { top: _top, left: _left }
}

function getToolBarStyle_iframe(rect: DOMRect) {
  const iframe = getIframe()
  const iframeRect = iframe.getBoundingClientRect();
  const res = concatRectDom(rect, iframeRect)
  return setToolBarStle(res)
}

// 订阅 range
// 处理 document 为 iframe 
lighlightBus.on(({ range, scrollTop }) => {
  webHighlight.setOption({ root: getIframeDoc()! })
  const { source, rect } = webHighlight.fromRange(range)

  source.scrollTop = scrollTop;
  source.chapter = readingBook.chapter;

  const { top, left } = getToolBarStyle_iframe(rect)
  useToolbarStore().openToolBar(source, top, left)
  // 由于 不同格式的电子书，渲染方案是不一样的，所以需要额外处理
  // handleBookHighlight()
})

// 添加高亮区域点击事件
webHighlight.on(EventType.click, (value, source) => {

})


lighlighClickBus.on((target) => {
  const iframe = getIframe()!
  const selection = iframe.contentDocument!.getSelection()
  if (!(selection && selection.isCollapsed)) return

  const useToolBar = useToolbarStore()
  if (isHeightWrap(target)) {
    const id = target.getAttribute(DATA_WEB_HIGHLIGHT)!
    const source = webHighlight.getSource(id);
    if (source) {
      const rect = target.getBoundingClientRect();
      const { top, left } = getToolBarStyle_iframe(rect)
      useToolBar.openToolBar(source, top, left)
    }

  } else {
    useToolBar.closeTooBar()
  }
})
function handlePdfPageNumber(range: Range) {
  let result = 0;
  if (range) {
    let node = range.startContainer.parentElement;
    let count = 0;

    while (node) {
      count++
      if (node.className === 'page') {
        const n = node.getAttribute('data-page-number');
        if (n) {
          result = +n
        }
      }
      if (count === 90) {
        break
      }
      node = node.parentElement;
    }
  }
  return result.toString()
}


function findCurrentTatalog({ num, gen }: RefProxy) {
  const stack: any[] = [];
  const add = (list: any[]) => {
    for (let i = list.length - 1; i >= 0; i--) {
      stack.push(list[i])
    }
  }
  add(readingBook.catalog)

  let result = null;
  let current;
  while (current = stack.pop()) {
    const target = current.dest[0];
    if (target.num === num && target.gen === gen) {
      result = current;
      break;
    }
    add(current.items)
  }

  return result
}
// 此方法用于 document为window，如果是iframe，则无效，需要手动监听 iframe 的range事件，然后通过 lighlightBus 发布 选中的range
export async function watchHighlight() {
  const range = webHighlight.range();
  if (range) {
    const refProxy = await getPdfCurrentPageRef();
    if (!refProxy) return;

    const item = findCurrentTatalog(refProxy)

    console.log(item)

    const { scrollTop, scrollLeft } = getEleById(VIEWERCONTAINER)! as HTMLDivElement;
    const { source, rect: { top, left } } = webHighlight.fromRange(range)
    source.scrollTop = scrollTop;
    source.chapter = item.title;
    const useToolBar = useToolbarStore()
    useToolBar.openToolBar(source, `${top + scrollTop - 115}px`, `${left + scrollLeft}px`)
  }
}

async function updateRoot() {
  const root = await getBookRoot();
  console.log(root)
  if (root) {
    webHighlight.setOption({ root })
  }
}

export async function paintWebHighlightFromSource(domSource: DomSource[] | DomSource) {
  await updateRoot()
  webHighlight.fromSource(domSource)
}

export async function updateWebHighlight(domSource: DomSource) {
  await updateRoot()
  webHighlight.updateClass(domSource)
}
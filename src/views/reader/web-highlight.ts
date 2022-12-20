import { VIEWERCONTAINER } from "src/constants";
import { lighlighClickBus, lighlightBus } from "src/core/bus";
import { getPdfCurrentCurrentPageNumber, getPdfTitle } from "src/core/file";
import { DomSource, EventType, isHeightWrap, WebHighlight } from "src/core/web-highlight";
import { DATA_WEB_HIGHLIGHT } from "src/core/web-highlight/constant";
import { Bookextname } from "src/enums";
import { getReadingBook } from "src/store";
import { useToolbarStore } from "src/store/toolbar";
import { concatRectDom, getEleById, getIframe, getIframeDoc, getPDFPageSelector, selector } from "src/utils";

const webHighlight = new WebHighlight({});
const readingBook = getReadingBook();

async function getPdfRoot() {
  const pageNumber = getPdfCurrentCurrentPageNumber()
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
})

// 添加高亮区域点击事件
webHighlight.on(EventType.click, (rect, source) => {
  const [top, left] = handlePdfRect(rect)
  useToolbarStore().editTooBar(source, top, left)
  console.log({ top, left, source })
})

// 由于 iframe 会隔离 事件，所以需要通过 观察者 重新监听事件
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

function handlePdfRect({ top, left }: DOMRect): [string, string] {
  const { scrollTop, scrollLeft } = getEleById(VIEWERCONTAINER)! as HTMLDivElement;
  return [`${top + scrollTop - 115}px`, `${left + scrollLeft}px`]
}


// 此方法用于 document为window，如果是iframe，则无效，需要手动监听 iframe 的range事件，然后通过 lighlightBus 发布 选中的range
export async function watchHighlight() {
  const range = webHighlight.range();
  if (range) {
    const title = await getPdfTitle(range, readingBook.catalog)

    console.log('title', title)
    if (!title) return

    await updateRoot();

    const { source, rect } = webHighlight.fromRange(range)
    const [top, left] = handlePdfRect(rect)

    source.scrollTop = 0; // 此处带处理（document为iframe的情况)
    source.chapter = title;

    const useToolBar = useToolbarStore()
    useToolBar.openToolBar(source, top, left)
  }
}

async function updateRoot() {
  const root = await getBookRoot();
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

export async function removeWebHighlight(id: string) {
  await removeWebHighlightDom(id)
  removeWebHighlightDomSouce(id)
}

export async function removeWebHighlightDom(id: string) {
  await updateRoot()
  webHighlight.removeDom(id)
}

export async function removeWebHighlightDomSouce(id: string) {
  webHighlight.removeSource(id)
}
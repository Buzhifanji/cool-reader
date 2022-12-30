import { VIEWERCONTAINER } from "src/constants";
import { pdf, useReadBookStore } from "src/core/book";
import { Bookextname } from "src/enums";
import { lighlighClickBus, lighlightBus } from "src/core/bus";
import { DomSource, EventType, isHeightWrap, WebHighlight } from "src/core/web-highlight";
import { DATA_WEB_HIGHLIGHT } from "src/core/web-highlight/constant";
import { useToolbarStore } from "src/store";
import { concatRectDom, getEleById, getIframe, getIframeDoc, getPDFPageSelector, selector } from "src/utils";

const webHighlight = new WebHighlight({});

async function getPdfRoot() {
  const pageNumber = pdf.getCurrentPageNumber()
  const selctor = getPDFPageSelector(pageNumber);
  return selector(selctor);
}

async function getBookRoot() {
  const bookStore = useReadBookStore();
  switch (bookStore.readingBook.extname) {
    case Bookextname.pdf:
      return await getPdfRoot();
    case Bookextname.epub:
    case Bookextname.mobi:
    case Bookextname.azw3:
    case Bookextname.txt:
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
  const bookStore = useReadBookStore();
  webHighlight.setOption({ root: getIframeDoc()! })
  const { source, rect } = webHighlight.fromRange(range)

  source.scrollTop = scrollTop;
  source.chapter = bookStore.readingBook.chapter;

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
    const bookStore = useReadBookStore();

    const title = await pdf.getTitle(range, bookStore.readingBook.catalog)

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
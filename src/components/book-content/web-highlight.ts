import { lighlightBus } from "src/core/bus";
import { EventType, WebHighlight } from "src/core/web-highlight";
import { Bookextname } from "src/enums";
import { getReadingBook } from "src/store";
import { concatRectDom, getIframe } from "src/utils";
import { openToolBar } from "./toolbar";

const webHighlight = new WebHighlight({});
const readingBook = getReadingBook();

function handleBookHighlight() {
  switch (readingBook.extname) {
    case Bookextname.pdf:
    case Bookextname.epub:
    default:
  }
}

// 订阅 range
// 处理 document 为 iframe 
lighlightBus.on(({ range, scrollTop }) => {
  const iframe = getIframe()
  if (iframe) {
    const iframeRect = iframe.getBoundingClientRect();
    const { source, rect } = webHighlight.fromRange(range)

    source.scrollTop = scrollTop;
    source.chapter = readingBook.chapter;

    const res = concatRectDom(rect, iframeRect)
    openToolBar(source, res)
  }
  // 由于 不同格式的电子书，渲染方案是不一样的，所以需要额外处理
  // handleBookHighlight()
  // 
  // openToolBar()
})

// 添加高亮区域点击事件
webHighlight.on(EventType.click, (value, source) => {

})

// 此方法用于 document为window，如果是iframe，则无效，需要手动监听 iframe 的range事件，然后通过 lighlightBus 发布 选中的range
export function watchHighlight() {
  const range = webHighlight.range();
  if (range) {
    const { source, rect } = webHighlight.fromRange(range)
    openToolBar(source, rect)
  }
}

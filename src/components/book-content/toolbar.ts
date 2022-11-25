import { barEnum, Bookextname } from "src/enums";
import {
  Copy,
  Delete,
  Idea,
  TextHighlight,
  TextUnderline,
} from "@vicons/carbon";
import { EventType, DomSource } from "src/core/web-highlight";
import { concatRectDom, createTime, getEleById } from "src/utils";
import { dialog, message } from "src/naive";
import { HIGHLIGHT_STRAIGHT_CLASS_NAME, HIGHLIGHT_TIIDE_CLASS_NAME, WEB_HEGHLIGHT_WRAPPER_DEFALUT } from "src/constants";
import { saveNotes, updateNotes } from "src/server/notes";
import { getPageNumber, getReadingBook, paintWebHighlightFromRange, prevWebHighlight, updateWebHighlight } from "src/store";
import { getHighlights, removeHighlight } from "../highlight/highlight";
import { getWebHighlight } from "src/store";
import { openIdea, removeMessage } from "../idea-input";
import { useDialog } from "naive-ui";
import { removeIdea } from "../idea/idea";

interface ToolBar {
  show: boolean;
  edit: boolean;
  source: null | DomSource;
}

const readingBook = getReadingBook();

const toolBarModel = () => ({ show: false, source: null, edit: false });
const toolBarStyle = shallowReactive({ top: '0px', left: '0px' });
const toolBar = shallowReactive<ToolBar>(toolBarModel())


function handlePdfPageNumber(range: Range) {
  let result = 0;
  if (range) {
    let node = range.startContainer.parentElement;
    let count = 0;

    while (node) {
      count++
      if (node.className === 'page') {
        result = +node.getAttribute('data-page-number')
      }
      if (count === 90) {
        break
      }
      node = node.parentElement;
    }
  }
  return result.toString()
}
function hanldePageNumber(range: Range) {
  switch (readingBook.extname) {
    case Bookextname.pdf:
      return handlePdfPageNumber(range)
    case Bookextname.epub:
      return getPageNumber().value
    default:
      return '0'
  }
}
const setToolBarStle = ({ top, left, height }: { top: number, left: number, height: number }) => {
  const { scrollTop, scrollLeft } = getEleById('viewerContainer');
  toolBarStyle.top = (top + scrollTop - height - 66) + 'px';
  toolBarStyle.left = (left + scrollLeft) + 'px'
}

// 添加高亮区域点击事件
const addWebHighlightEvent = () => {
  const webHighlight = getWebHighlight();

  webHighlight.on(EventType.click, (value, source) => {
    toolBar.show = true;
    toolBar.source = source as DomSource;
    toolBar.edit = true;
    setToolBarStle(value)
  })

  return webHighlight
}

const openToolBar = (range: Range, _rect?: DOMRect) => {
  // 由于 pdf 格式的书本，渲染是 占位 + 按需渲染，所以dom是动态的，这就导致,如果 定位容器节点为 body，则就会产生bug，
  // 目前处理方案：容器节点为当前页面节点。查找当前页，是一个向上寻找dom的过程。
  const pageNumber = hanldePageNumber(range);
  const { source, rect } = prevWebHighlight(pageNumber, true, range)

  // epub.js 渲染采用iframe（不是iframe，存在bug，所以没有采用），此处是拼接iframe的getboundingclientrect
  const res = concatRectDom(rect, _rect)

  source.pageNumber = pageNumber;
  toolBar.show = true;
  toolBar.source = source


  setToolBarStle(res)
}

export const epubWebHighlight = (range: Range, rect: DOMRect) => {
  addWebHighlightEvent();
  openToolBar(range, rect)

  // 关闭 输入消息 组件
  removeMessage()
}

export function initTooBar() {
  toolBar.show = false;
  toolBar.source = null;
  toolBar.edit = false;

  toolBarStyle.top = '0px'
  toolBarStyle.left = '0px'

  removeMessage()
}

// 划词 高亮
export const useHighlight = () => {
  const webHighlight = addWebHighlightEvent();

  function watchHighlight() {
    const range = webHighlight.range();
    if (range) {
      openToolBar(range)
    }

    // 关闭 输入消息 组件
    removeMessage()
  }

  return { watchHighlight }
}

export const useToolBar = () => {
  const list = [
    { label: "复制", key: barEnum.Copy, icon: Copy },
    { label: "高亮", key: barEnum.TextHighlight, icon: TextHighlight },
    { label: "波浪线", key: barEnum.tilde, icon: TextUnderline },
    { label: "直线", key: barEnum.straightLine, icon: TextUnderline },
    { label: "笔记", key: barEnum.idea, icon: Idea },
  ];

  const bars = computed(() => {
    if (toolBar.edit) {
      const editer = { label: "删除", key: barEnum.edit, icon: Delete };
      return [...list, editer];
    } else {
      return [...list];
    }
  });


  function barAction(key: barEnum) {
    switch (key) {
      case barEnum.Copy:
        copyText();
        break;
      case barEnum.TextHighlight:
        addTextHighlight()
        break;
      case barEnum.tilde:
        addTilde();
        break
      case barEnum.straightLine:
        addStraightLine();
        break
      case barEnum.edit:
        remove()
        break
      case barEnum.idea:
        ideaInput()
        break
    }
    toolBar.show = false
  }

  function copyText() {
    if (navigator.clipboard && toolBar.source) {
      navigator.clipboard.writeText(toolBar.source.text).then(() => {
        message.success("复制成功！");
      });
    } else {
      // 兼容性
    }
  }

  // 高亮
  function addTextHighlight() {
    notesAction(WEB_HEGHLIGHT_WRAPPER_DEFALUT)
  }

  // 波浪线
  function addTilde() {
    notesAction(HIGHLIGHT_TIIDE_CLASS_NAME);
  }

  // 直线
  function addStraightLine() {
    notesAction(HIGHLIGHT_STRAIGHT_CLASS_NAME);
  }
  // 删除
  function remove() {
    const { source } = toolBar
    if (source) {
      const content = source.notes.content
      if (content) {
        dialog.warning({
          title: "警告",
          content: `删除笔记：${content}`,
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            removeIdea(source)
          }
        })
      } else {
        removeHighlight(source)
      }
    }
  }
  // 写想法
  function ideaInput() {
    paintWebHighlightFromRange(toolBar.source)
    openIdea(toolBar.source, toolBar.edit)
  }

  function notesAction(className?: string) {
    const { source, edit } = toolBar
    if (source) {
      if (edit) {
        // 编辑
        if (className !== source.className) {
          if (className) {
            source.className = className
          }
          // 更新ui
          updateWebHighlight(source)
          // 存入数据库
          updateNotes(source)
        }
      } else {
        // 创建
        if (className) {
          source.className = className
        }
        source.bookId = readingBook.id;

        source.notes.createTime = createTime()
        paintWebHighlightFromRange(source)

        saveNotes(source).then(() => {
          getHighlights()
        })
      }
    }
  }

  function closeTooBar() {
    if (toolBar.edit) {
      initTooBar()
    }
  }

  return { bars, toolBar, barAction, toolBarStyle, closeTooBar }
}
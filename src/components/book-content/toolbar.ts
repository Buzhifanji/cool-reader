import { barEnum, Bookextname } from "src/enums";
import {
  Copy,
  Delete,
  Idea,
  TextHighlight,
  TextUnderline,
} from "@vicons/carbon";
import { EventType, DomSource } from "src/core/web-highlight";
import { getEleById } from "src/utils";
import { message } from "src/naive";
import { HIGHLIGHT_STRAIGHT_CLASS_NAME, HIGHLIGHT_TIIDE_CLASS_NAME } from "src/constants";
import { saveNotes, updateNotes } from "src/server/notes";
import { getPageNumber, getReadingBook, paintWebHighlightFromRange, prevWebHighlight, updateOptionRoot, updateWebHighlight } from "src/store";
import { getHighlights, removeHighlight } from "../highlight/highlight";
import { getIdeas } from "../idea/idea";
import { getWebHighlight } from "src/store";

interface ToolBar {
  show: boolean;
  edit: boolean;
  source: null | DomSource;
}

const readingBook = getReadingBook();

const toolBarModel = () => ({ show: false, source: null, edit: false });
const toolBarStyle = shallowReactive({ top: '0px', left: '0px' });
const toolBar = shallowReactive<ToolBar>(toolBarModel())

let range: Range | null = null; // 用于定位 range 的容器节点

function handlePdfPageNumber() {
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
  return result
}
function hanldePageNumber() {
  switch (readingBook.extname) {
    case Bookextname.pdf:
      return handlePdfPageNumber()
    default:
      return 0
  }
}

// 划词 高亮
export const useHighlight = () => {
  const webHighlight = getWebHighlight();

  const setToolBarStle = ({ top, left, height }: DOMRect) => {
    const { scrollTop, scrollLeft } = getEleById('viewerContainer');
    toolBarStyle.top = (top + scrollTop - height - 66) + 'px';
    toolBarStyle.left = (left + scrollLeft) + 'px'
  }

  webHighlight.on(EventType.click, (value, source) => {
    toolBar.show = true;
    toolBar.source = source as DomSource;
    toolBar.edit = true;
    setToolBarStle(value)
  })

  function watchHighlight() {
    range = webHighlight.range();
    if (range) {
      // 由于 pdf 格式的书本，渲染是 占位 + 按需渲染，所以dom是动态的，这就导致如果 定位容器节点为 body，则就会产生bug，
      // 目前处理方案：容器节点为当前页面节点。查找当前页，是一个向上寻找dom的过程。
      const pageNumber = hanldePageNumber();
      const { source, rect } = prevWebHighlight(pageNumber)

      source.pageNumber = pageNumber;
      toolBar.show = true;
      toolBar.source = source

      setToolBarStle(rect)
    }
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
    notesAction()
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
    if (toolBar.source) {
      if (toolBar.source.notes) {

      } else {
        removeHighlight(toolBar.source)
      }
    }
  }
  // 写想法
  function ideaInput() {

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
          updateWebHighlight(source)
          updateNotes(source)
        }
      } else {
        // 创建
        if (className) {
          source.className = className
        }
        source.bookId = readingBook.id;

        paintWebHighlightFromRange(source)

        saveNotes(source).then(() => {
          getHighlights()
          getIdeas()
        })
      }
    }
  }
  return { bars, toolBar, barAction, toolBarStyle }
}
import { barEnum } from "src/enums";
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
import { saveNotes } from "src/server/notes";
import { getPageNumber, getReadingBook } from "src/store";
import { getHighlights } from "../highlight/highlight";
import { getIdeas } from "../idea/idea";
import { getWebHighlight } from "src/store";

interface ToolBar {
  id: string;
  show: boolean;
  edit: boolean;
  source: null | DomSource;
}


const toolBarModel = () => ({ id: "", show: false, source: null, edit: false });
const toolBarStyle = shallowReactive({ top: '0px', left: '0px' });
const toolBar = shallowReactive<ToolBar>(toolBarModel())


// 划词 高亮
export const useHighlight = () => {
  const webHighlight = getWebHighlight();

  const setToolBarStle = ({ top, left, width, height }: DOMRect) => {
    const { scrollTop, scrollLeft } = getEleById('viewerContainer');
    toolBarStyle.top = (top + scrollTop - height - 66) + 'px';
    toolBarStyle.left = (left + scrollLeft) + 'px'
  }
  webHighlight.on(EventType.click, setToolBarStle)

  webHighlight.on(EventType.range, setToolBarStle)

  function watchHighlight() {
    const source = webHighlight.range();
    if (source) {
      toolBar.show = true;
      toolBar.id = source.id;
      toolBar.source = source
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
  }

  function copyText() {
    if (navigator.clipboard && toolBar.source) {
      navigator.clipboard.writeText(toolBar.source.text).then(() => {
        message.success("复制成功！");
        toolBar.show = false;
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
    // useRemoveHighlight(toolBar.source!.id);
  }
  // 写想法
  function ideaInput() {

  }

  function notesAction(className?: string) {
    const { source, edit, id } = toolBar
    if (source) {
      const webHighlight = getWebHighlight();
      webHighlight.paint(id, className)
      toolBar.show = false
      if (edit) {
        // 编辑
      } else {
        // 创建
        const readingBook = getReadingBook();
        source.bookId = readingBook.id;
        source.pageNumber = getPageNumber().value
        saveNotes(source).then(() => {
          getHighlights()
          getIdeas()
        })
        console.log(source)
      }
    }
  }
  return { bars, toolBar, barAction, toolBarStyle }
}
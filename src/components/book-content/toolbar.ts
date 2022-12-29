import { barEnum } from "src/enums";
import {
  Copy,
  Delete,
  Idea,
  TextHighlight,
  TextUnderline,
} from "@vicons/carbon";
import { createTime } from "src/utils";
import { dialog, message } from "src/naive";
import { HIGHLIGHT_STRAIGHT_CLASS_NAME, HIGHLIGHT_TIIDE_CLASS_NAME, NOTES_CHANGE, WEB_HEGHLIGHT_WRAPPER_DEFALUT } from "src/constants";
import { saveNotes, updateNotes } from "src/server/notes";
import { getReadingBook } from "src/store";
import { getHighlights, removeHighlight } from "../highlight/highlight";
import { openIdea } from "../idea-input";
import { removeIdea } from "../idea/idea";
import { emit } from '@tauri-apps/api/event'
import { useToolbarStore } from "src/store/toolbar";
import { paintWebHighlightFromSource, updateWebHighlight } from "src/views/reader/web-highlight";

const readingBook = getReadingBook();

export const useToolBar = () => {
  const toolBar = useToolbarStore()
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
    const { source, edit } = toolBar
    if (source) {
      paintWebHighlightFromSource(source)
      openIdea(source, edit)
    }
  }

  function notesAction(className: string) {
    const { source, edit } = toolBar
    if (source) {
      if (edit) {
        // 编辑
        if (className !== source.className) {
          source.className = className
          console.log(source)
          // 更新ui
          updateWebHighlight(source)
          // 存入数据库
          updateNotes(source).then(() => {
            emit(NOTES_CHANGE, source)
          })
        }
      } else {
        // 创建
        source.className = className
        source.bookId = readingBook.id;

        source.notes.createTime = createTime()

        delete source.pageNumber
        console.log(source)
        paintWebHighlightFromSource(source)

        saveNotes(source).then(() => {
          emit(NOTES_CHANGE, source)
          getHighlights()
        })
      }
    }
  }

  return { bars, barAction }
}
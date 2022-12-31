<script setup lang="ts">
import { useSroll } from 'src/core/scroll';
import { useToolbarStore } from 'src/store';
import { barEnum } from 'src/enums';
import { dialog, message } from "src/naive";
import { HIGHLIGHT_STRAIGHT_CLASS_NAME, HIGHLIGHT_TIIDE_CLASS_NAME, NOTES_CHANGE, WEB_HEGHLIGHT_WRAPPER_DEFALUT } from "src/constants";

import { Copy, Delete, Idea, TextHighlight, TextUnderline, } from "@vicons/carbon";

import { saveNotes, updateNotes } from "src/server/notes";
import { paintWebHighlightFromSource, updateWebHighlight, removeWebHighlight, watchHighlight } from "../web-highlight";
import { createTime } from 'src/utils';
import { emit } from '@tauri-apps/api/event'
import { useReadBookStore } from 'src/core/book';
import { useBookNotesStore } from 'src/store';
import { openIdea } from '../idea/input'

const { container, onScroll } = useSroll()

const toolBar = useToolbarStore()
const bookStore = useReadBookStore();
const notesStore = useBookNotesStore();

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
          notesStore.deleteBookNotes(source)
          removeWebHighlight(source.id)
        }
      })
    } else {
      notesStore.deleteBookNotes(source)
      removeWebHighlight(source.id)
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
      source.bookId = bookStore.readingBook.id;

      source.notes.createTime = createTime()

      delete source.pageNumber
      console.log(source)
      paintWebHighlightFromSource(source)

      saveNotes(source).then(() => {
        emit(NOTES_CHANGE, source)
        notesStore.getBookNotes();
      })
    }
  }
}
</script>

<template>
  <div id="viewerContainer" ref="container" @scroll="onScroll" @click="watchHighlight">
    <div id="page-area" class="pdfViewer" @click="toolBar.closeTooBar"></div>
    <div class="tool-bar-wrapper" :style="toolBar.toolBarStyle" ref="toolBarRef" v-show="toolBar.show">
      <n-space>
        <n-space vertical v-for="item in bars" :key="item.key" @click.stop="barAction(item.key)">
          <n-icon :component="item.icon" size="16" />
          <div quaternary>{{ item.label }}</div>
        </n-space>
      </n-space>
    </div>
  </div>
</template>

<style scoped>
#viewerContainer {
  height: 100%;
  overflow-y: auto;
}

.tool-bar-wrapper {
  box-sizing: border-box;
  position: absolute;
  border: 1px solid var(--n-border-color);
  border-radius: var(--n-border-radius);
  padding: 10px 14px;
  color: #fff;
  background-color: rgba(38, 38, 38, 1);
  transition: box-shadow .3s var(--n-bezier), background-color .3s var(--n-bezier), color .3s var(--n-bezier);
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  line-height: 18px;
  overflow: visible;
  z-index: 9;
}

.tool-bar-wrapper::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -4px;
  border-color: #444 transparent transparent;
  border-width: 4px 4px 0;
  border-style: solid;
  height: 0;
  width: 0;
}
</style>
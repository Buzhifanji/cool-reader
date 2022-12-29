<script setup lang="ts">
import { Delete, FaceWink } from "@vicons/carbon";

import { langField } from "src/i18n";
import { useBookNotesStore } from "src/store";
import { useReadBookStore } from "src/core/book";

import { paintWebHighlightFromSource, removeWebHighlight } from "../web-highlight"
import { DomSource } from "src/core/web-highlight";
import { useHandleCatalogJump } from '../reader'


const notesStore = useBookNotesStore();

const bookStore = useReadBookStore();

const { jumpByChapter } = useHandleCatalogJump()


watch(() => bookStore.readingBook.chapter, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    const list = notesStore.bookHighlights.filter(value => value.chapter === bookStore.readingBook.chapter);

    if (list.length > 0) {
      paintWebHighlightFromSource(list)
    }
  }
})

function removeHighlight(source: DomSource) {
  notesStore.deleteBookNotes(source)
  removeWebHighlight(source.id)
}

</script>

<template>
  <n-list hoverable clickable v-if="notesStore.bookHighlights.length">
    <n-list-item v-for="item in notesStore.bookHighlights" :key="item.id" @click="jumpByChapter(item.chapter)">
      <template #suffix>
        <n-icon size="16" :component="Delete" @click.stop="removeHighlight(item)" />
      </template>
      <n-ellipsis :line-clamp="2">
        {{ item.text }}
      </n-ellipsis>
    </n-list-item>
  </n-list>
  <n-empty :description="langField.nothing" v-else>
    <template #icon>
      <n-icon>
        <FaceWink />
      </n-icon>
    </template>
  </n-empty>
</template>

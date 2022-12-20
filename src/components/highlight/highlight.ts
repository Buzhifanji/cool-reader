import { DomSource } from "src/core/web-highlight";
import { getHeighlightsById, removeNotes } from "src/server/notes";
import {
  getReadingBook,
} from "src/store";

import { paintWebHighlightFromSource, removeWebHighlight } from "src/views/reader/web-highlight"

export const highlights = ref<DomSource[]>([]);

const readingBook = getReadingBook();

watch(() => readingBook.chapter, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    const list = highlights.value.filter(value => value.chapter === readingBook.chapter);

    if (list.length > 0) {
      paintWebHighlightFromSource(list)
    }
  }
})


export function getHighlights() {
  getHeighlightsById(readingBook.id).then(value => {
    highlights.value = value;
  })
}

export function hasHighlight(id: string) {
  return highlights.value.some(value => value.id === id);
}

export function removeHighlight({ id, bookId }: DomSource) {
  removeNotes(bookId, id).then(() => {
    removeWebHighlight(id)
    getHighlights()
  })
}

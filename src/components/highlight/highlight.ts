import { DomSource } from "src/core/web-highlight";
import { getHeighlightsById, removeNotes } from "src/server/notes";
import {
  getReadingBook,
  paintWebHighlightFromSource,
  getPageNumber,
  removeWebHighlight,
} from "src/store";

export const highlights = ref<DomSource[]>([]);

const pageNumber = getPageNumber();

watch(pageNumber, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    const list = highlights.value.filter(value => value.pageNumber === pageNumber.value);
    if (list.length > 0) {
      paintWebHighlightFromSource(list)
    }

  }
})


export function getHighlights() {
  const readingBook = getReadingBook();
  getHeighlightsById(readingBook.id).then(value => {
    highlights.value = value;
  })
}

export function removeHighlight({ id, bookId }: DomSource) {
  removeNotes(bookId, id).then(() => {
    removeWebHighlight(id)
    getHighlights()
  })
}

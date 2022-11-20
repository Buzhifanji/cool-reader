import { DomSource } from "src/core/web-highlight";
import { getHeighlightsById, removeNotes } from "src/server/notes";
import {
  getReadingBook,
  paintHighlight,
  getPageNumber,
  removeWebHighlight,
} from "src/store";

export const highlights = ref<DomSource[]>([]);

const pageNumber = getPageNumber();

watchEffect(() => {
  const list = highlights.value.filter(value => value.pageNumber === pageNumber.value);
  paintHighlight(list)
});

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

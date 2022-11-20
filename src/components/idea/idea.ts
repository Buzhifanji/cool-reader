import { pageNumber } from "src/core/notes/notes";
import { domSourceFromStore } from "src/core/toolbar";
import { DomSource } from "src/core/web-highlight";
import { getAllNotes, getIdeasById } from "src/server/notes";
import { getReadingBook, paintWebHighlightFromSource } from "src/store";

export const notes = ref<DomSource[]>([]);



watchEffect(() => {
  const list = notes.value.filter(value => value.pageNumber === pageNumber.value)
  if (list.length) {
    paintWebHighlightFromSource(list)
  }
});

export function getIdeas() {
  const readingBook = getReadingBook();
  getIdeasById(readingBook.id).then(value => {
    notes.value = value;
  })
}

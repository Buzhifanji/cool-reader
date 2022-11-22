import { DomSource } from "src/core/web-highlight";
import { getIdeasById } from "src/server/notes";
import { getPageNumber, getReadingBook, paintWebHighlightFromSource } from "src/store";

export const notes = ref<DomSource[]>([]);

const pageNumber = getPageNumber();

watch(pageNumber, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    const list = notes.value.filter(value => value.pageNumber === pageNumber.value);

    if (list.length > 0) {
      paintWebHighlightFromSource(list)
    }
  }
})


export function getIdeas() {
  const readingBook = getReadingBook();
  getIdeasById(readingBook.id).then(value => {
    notes.value = value;
  })
}

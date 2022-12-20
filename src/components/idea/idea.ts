import { DomSource } from "src/core/web-highlight";
import { getIdeasById, removeNotes } from "src/server/notes";
import { getReadingBook } from "src/store";
import { paintWebHighlightFromSource, removeWebHighlight } from "src/views/reader/web-highlight"

export const notes = ref<DomSource[]>([]);

const readingBook = getReadingBook();

watch(() => readingBook.chapter, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    const list = notes.value.filter(value => value.chapter === readingBook.chapter);

    if (list.length > 0) {
      paintWebHighlightFromSource(list)
    }
  }
})

export function hasIdea(id: string) {
  return notes.value.some(value => value.id === id);
}

export function getIdeas() {
  const readingBook = getReadingBook();
  getIdeasById(readingBook.id).then(value => {
    notes.value = value;
  })
}

export function removeIdea({ id, bookId }: DomSource) {
  removeNotes(bookId, id).then(() => {
    removeWebHighlight(id)
    getIdeas()
  })
}
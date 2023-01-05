import { DomSource, Notes } from "src/core/web-highlight";
import { defineStore } from "pinia";
import { useReadBookStore } from "src/core/book";
import { BookNotes, getAllNotes, getNotesByBookId } from "src/core/data-base";
import { useBookNotes } from "src/core/use";
import { isHightlight, isIdea } from "src/utils";

type Filter = (notes: Notes) => boolean

const filterNotes = (value: BookNotes[], callback: Filter) => {
  return value.filter(notes => callback(notes.notes))
}

const getIdeas = (value: BookNotes[]) => filterNotes(value, isIdea);
const getHighlights = (value: BookNotes[]) => filterNotes(value, isHightlight);

// 具体某本书的笔记
export const useBookNotesStore = defineStore('bookNotesStore', () => {
  const bookStore = useReadBookStore();

  const bookNotes = ref<BookNotes[]>([]);
  const bookHighlights = computed(() => getHighlights(bookNotes.value))
  const bookIdeas = computed(() => getIdeas(bookNotes.value))

  function getBookNotes() {
    const bookId = bookStore.readingBook.id;
    return getNotesByBookId(bookId).then(notes => bookNotes.value = notes)
  }

  function hasBookNotes(id: string) {
    return bookNotes.value.some(value => value.id === id);
  }

  function deleteBookNotes(source: DomSource) {
    const { removeNotesById } = useBookNotes()
    return removeNotesById(source)
  }

  return { bookHighlights, bookIdeas, hasBookNotes, deleteBookNotes, getBookNotes }
})

// 全部笔记内容
export const useAllNotesStore = defineStore('allNotesStore', () => {
  const allNotes = ref<BookNotes[]>([])

  const allHighlights = computed(() => getHighlights(allNotes.value))

  const allIdeas = computed(() => getIdeas(allNotes.value))

  function updateAllNotes() {
    return getAllNotes().then(value => allNotes.value = value)
  }

  function hasNotes(id: string) {
    return allNotes.value.some(value => value.id === id);
  }

  return { allNotes, allHighlights, allIdeas, updateAllNotes, hasNotes }
})

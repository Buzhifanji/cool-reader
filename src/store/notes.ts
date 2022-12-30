import { DomSource, Notes } from "src/core/web-highlight";
import { getAllNotes, getNotesByBookId, removeNotes } from "src/server/notes";
import { defineStore } from "pinia";
import { useReadBookStore } from "src/core/book";

type Filter = (notes: Notes) => boolean

const filterNotes = (value: DomSource[], callback: Filter) => {
  return value.filter(notes => callback(notes.notes))
}

const getIdeas = (value: DomSource[]) => filterNotes(value, (notes) => notes.content.length > 0);
const getHighlights = (value: DomSource[]) => filterNotes(value, (notes) => notes.content.length === 0);

// 具体某本书的笔记
export const useBookNotesStore = defineStore('bookNotesStore', () => {
  const bookStore = useReadBookStore();

  const bookNotes = ref<DomSource[]>([]);
  const bookHighlights = computed(() => getHighlights(bookNotes.value))
  const bookIdeas = computed(() => getIdeas(bookNotes.value))

  function getBookNotes() {
    const bookId = bookStore.readingBook.id;
    return getNotesByBookId(bookId).then(notes => bookNotes.value = notes)
  }

  function hasBookNotes(id: string) {
    return bookNotes.value.some(value => value.id === id);
  }

  function deleteBookNotes({ id, bookId }: DomSource) {
    return removeNotes(bookId, id).then(() => {
      getBookNotes()
      return 'ok'
    })
  }

  return { bookHighlights, bookIdeas, hasBookNotes, deleteBookNotes, getBookNotes }
})

// 全部笔记内容
export const useAllNotesStore = defineStore('allNotesStore', () => {
  const allNotes = ref<DomSource[]>([])

  const allHighlights = computed(() => getHighlights(allNotes.value))

  const allIdeas = computed(() => getIdeas(allNotes.value))

  function updateAllNotes() {
    return getAllNotes().then(value => allNotes.value = value)
  }

  function hasNotes(id: string) {
    return allNotes.value.some(value => value.id === id);
  }

  function deleteNotes({ id, bookId }: DomSource) {
    return removeNotes(bookId, id).then(() => {
      updateAllNotes()
      return 'ok'
    })
  }

  return { allNotes, allHighlights, allIdeas, updateAllNotes, hasNotes, deleteNotes }
})

import { dexieStore } from './center';
import { BookNotes } from './interface';

export function addNotes(value: BookNotes) {
  return dexieStore.notes.add(value);
}

export function updateNotes(value: BookNotes) {
  return dexieStore.notes.put(value);
}

export function removeNotesById(id: string) {
  return dexieStore.notes.where({ id }).delete();
}

export function getAllNotes() {
  return dexieStore.notes.toArray();
}

export function getNotesByBookId(bookId: string) {
  return dexieStore.notes.where('bookId').equals(bookId).toArray();
}

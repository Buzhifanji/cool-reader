import { DomSource } from "src/core/web-highlight";
import { getAllNotes } from "src/server/notes";
import { isHightlight } from "src/utils";

const allNotes = ref<DomSource[]>([])

const _getAllNotes = () => getAllNotes().then(value => allNotes.value = value);

export function initAllNotes() {
  if (allNotes.value.length) {
    return Promise.resolve([])
  } else {
    return _getAllNotes()
  }
}

export function updateAllNotes() {
  return _getAllNotes()
}

export const getAllHighlights = () => allNotes.value.filter(isHightlight);

export const getAllIdeas = () => allNotes.value.filter(value => !isHightlight(value));
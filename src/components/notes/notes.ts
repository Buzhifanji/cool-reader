import { pageNumber } from "src/core/notes/notes";
import { domSourceFromStore } from "src/core/toolbar";
import { DomSource } from "src/interfaces";
import { getAllNotes } from "src/server/notes";
import { getReadingBook, saveDomSource } from "src/store";

export const notes = ref<DomSource[]>([]);

const readingBook = getReadingBook();

watchEffect(() => {
  const list = notes.value.filter(
    (value) => value.pageNumber === pageNumber.value
  );
  domSourceFromStore(list);
});

// 更新
export function updateNodes() {
  return getAllNotes(readingBook.id).then((value) => {
    // saveDomSource(value);
    // notes.value = value;
  });
}

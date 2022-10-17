import { pageNumber } from "@/core/notes/notes";
import { domSourceFromStore } from "@/core/toolbar";
import { DomSource } from "@/interfaces";
import { getNotes } from "@/server/notes";
import { getReadingBook } from "@/store";
import { ref, watchEffect } from "vue";

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
  return getNotes(readingBook.id).then((value) => (notes.value = value));
}

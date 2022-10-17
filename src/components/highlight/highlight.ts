import { pageNumber } from "@/core/notes/notes";
import { domSourceFromStore } from "@/core/toolbar";
import { DomSource } from "@/interfaces";
import { getHighlights } from "@/server/highlight";
import { getReadingBook } from "@/store";
import { ref, watchEffect } from "vue";

export const highlights = ref<DomSource[]>([]);

const readingBook = getReadingBook();

watchEffect(() => {
  const list = highlights.value.filter(
    (value) => value.pageNumber === pageNumber.value
  );
  domSourceFromStore(list);
});

// 更新
export function updateHighlights() {
  return getHighlights(readingBook.id).then(
    (value) => (highlights.value = value)
  );
}

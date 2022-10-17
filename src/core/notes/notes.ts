import { Bookextname } from "@/enums";
import { DomSource, ExtnameFn } from "@/interfaces";
import { message } from "@/naive";
import { getReadingBook } from "@/store";
import { ref } from "vue";
import { usePdfChangePage } from "../file";
import { useRemoveHighlight } from "./toobar";

export const pageNumber = ref<number>(1);
export function updatePageNumber(number: number) {
  pageNumber.value = number;
}

export const useNoteJumpAndRemove = () => {
  const readingBook = getReadingBook();
  const { pdfJumpToPage } = usePdfChangePage();
  const pageJumpStatus: ExtnameFn = {
    [Bookextname.pdf]: pdfJumpToPage,
    [Bookextname.epub]: () => message.warning("功能待开发中！"),
  };
  // 删除
  function remove({ id }: DomSource) {
    useRemoveHighlight(id);
  }
  // 跳转
  function jump(value: DomSource) {
    pageJumpStatus[readingBook.extname]?.(value.pageNumber);
  }
  return { remove, jump };
};

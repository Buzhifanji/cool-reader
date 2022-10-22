import { updateHighlights } from "@/components/highlight/highlight";
import { updateNodes } from "@/components/notes/notes";
import { resetToolBar } from "@/components/toolbar/toolbar";
import { Bookextname } from "@/enums";
import { DomSource, ExtnameFn } from "@/interfaces";
import { message } from "@/naive";
import { removeNotes } from "@/server/notes";
import { getDomSource, getReadingBook, removeDomSource } from "@/store";
import { ref } from "vue";
import { usePdfChangePage } from "../file";
import { deleteDomSource } from "../toolbar";

export const pageNumber = ref<number>(1);
const readingBook = getReadingBook();

export function updatePageNumber(number: number) {
  pageNumber.value = number;
}

export const useNoteJumpAndRemove = () => {
  const { pdfJumpToPage } = usePdfChangePage();
  const pageJumpStatus: ExtnameFn = {
    [Bookextname.pdf]: pdfJumpToPage,
    [Bookextname.epub]: () => message.warning("功能待开发中！"),
  };
  // 删除
  function remove({ id }: DomSource) {
    useRemoveNotes(id);
  }
  // 跳转
  function jump(value: DomSource) {
    pageJumpStatus[readingBook.extname]?.(value.pageNumber);
  }
  return { remove, jump };
};

function useRemoveNotes(id: string, isTip = true) {
  const source = getDomSource(id);
  if (source) {
    // 清除缓存
    deleteDomSource(source);
    // 清除 ui
    removeDomSource(id);
    // 清除数据库
    removeNotes(readingBook.id, id, isTip).then(() => {
      updateHighlights();
      updateNodes();
    });
    resetToolBar();
  }
}

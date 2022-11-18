import { updateHighlights } from "src/components/highlight/highlight";
import { updateNodes } from "src/components/notes/notes";
import { resetToolBar } from "src/components/toolbar/toolbar";
import { Bookextname, NotesType } from "src/enums";
import { DomSource, ExtnameFn } from "src/interfaces";
import { message } from "src/naive";
import { removeHighlight } from "src/server/highlight";
import { removeNotes } from "src/server/notes";
import { getDomSource, getReadingBook, removeDomSource } from "src/store";
import { usePdfChangePage } from "../file";
import { deleteDomSource } from "../toolbar";

export const pageNumber = ref<number>(1);
const readingBook = getReadingBook();

export function updatePageNumber(number: number) {
  pageNumber.value = number;
}

export const useNoteJumpAndRemove = (type: NotesType) => {
  const { pdfJumpToPage } = usePdfChangePage();
  const pageJumpStatus: ExtnameFn = {
    [Bookextname.pdf]: pdfJumpToPage,
    [Bookextname.epub]: () => message.warning("功能待开发中！"),
  };
  // 删除
  function remove({ id }: DomSource) {
    useRemoveNotes(id, type);
  }
  // 跳转
  function jump(value: DomSource) {
    pageJumpStatus[readingBook.extname]?.(value.pageNumber);
  }
  return { remove, jump };
};

function useRemoveNotes(id: string, type: NotesType) {
  const source = getDomSource(id);
  if (source) {
    // 清除 ui
    deleteDomSource(source);
    // 清除缓存
    removeDomSource(id);
  }
  // 清除数据库
  const fn = type === NotesType.notes ? removeNotes : removeHighlight;
  fn(readingBook.id, id, true).then(() => {
    updateHighlights();
    updateNodes();
  });
  resetToolBar();
}

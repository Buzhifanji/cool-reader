import { DomSource } from "@/interfaces";
import { changeNotes, deleteNotes, _getNotes } from "@/utils";

export function saveHighlight(param: DomSource) {
  return changeNotes(param, "add_highlight", "添加成功");
}

export function updateHighlight(param: DomSource) {
  return changeNotes(param, "update_highlight", "修改成功");
}

export function getHighlights(bookId: string): Promise<DomSource[]> {
  return _getNotes(bookId, "get_highlightes");
}

export function removeHighlight(book_id: string, id: string, isTip = true) {
  const data = { book_id, id };
  return deleteNotes(data, "delete_highlight", isTip);
}

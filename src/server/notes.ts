import { DomSource } from "@/interfaces";
import { changeNotes, deleteNotes, _getNotes } from "@/utils";

export function saveNotes(param: DomSource) {
  return changeNotes(param, "add_notes", "添加成功");
}

export function updateNotes(param: DomSource) {
  return changeNotes(param, "update_notes", "修改成功");
}

export function getNotes(bookId: string): Promise<DomSource[]> {
  return _getNotes(bookId, "get_notes");
}

export function removeHighlight(book_id: string, id: string, isTip = true) {
  const data = { book_id, id };
  return deleteNotes(data, "delete_notes", isTip);
}

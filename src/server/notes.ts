import { DomSource } from "src/interfaces";
import { changeNotes, deleteNotes, _getNotes } from "src/utils";

export function saveNotes(param: DomSource) {
  return changeNotes(param, "add_notes", "添加成功");
}

export function updateNotes(param: DomSource, msg = "添加成功") {
  return changeNotes(param, "update_notes", msg);
}

export function getNotes(bookId: string): Promise<DomSource[]> {
  return _getNotes(bookId, "get_notes");
}

export function removeNotes(book_id: string, id: string, isTip = true) {
  const data = { book_id, id };
  return deleteNotes(data, "delete_notes", isTip);
}

import { DomSource, highlightResponse } from "@/interfaces";
import { message } from "@/naive";
import { generateServiceParams } from "@/utils";
import { sortNotes } from "@/utils/sort";
import { invoke } from "@tauri-apps/api";

export function saveHighlight(param: DomSource) {
  const data = generateServiceParams<DomSource, highlightResponse>(param);
  return invoke("add_highlight", { data })
    .then(() => {
      message.success("添加成功");
    })
    .catch((err) => {
      message.error(err);
    });
}

export function updateHighlight(param: DomSource) {
  const data = generateServiceParams<DomSource, highlightResponse>(param);
  return invoke("update_highlight", { data })
    .then(() => {
      message.success("修改成功");
    })
    .catch((err) => {
      message.error(err);
    });
}

export function getHighlights(bookId: string): Promise<DomSource[]> {
  return new Promise((resolve) => {
    invoke("get_highlightes", { bookId })
      .then((value) => {
        const result = (value as highlightResponse[]).map((item) =>
          generateServiceParams<highlightResponse, DomSource>(item, false)
        );
        resolve(sortNotes(result));
      })
      .catch((err) => {
        message.error(err);
        resolve([]);
      });
  });
}

export function removeHighlight(book_id: string, id: string, isTip = true) {
  const data = { book_id, id };
  return invoke("delete_highlight", { data })
    .then(() => {
      isTip && message.success("删除成功");
    })
    .catch((err) => {
      message.error(err);
    });
}

import { invoke } from "@tauri-apps/api";
import { message } from "../../naive";
import { highlightParam, highlightResponse } from "../notes/type";
import { generateServiceParams } from "../utils/change-name";

function sortHighlights(arr: highlightParam[]) {
  return [...arr].sort((a, b) => {
    if (a.pageNumber > b.pageNumber) {
      return 1;
    } else if (a.pageNumber < b.pageNumber) {
      return -1;
    } else {
      if (a.startMeta.parentIndex > b.startMeta.parentIndex) {
        return 1;
      } else if (a.startMeta.parentIndex < b.startMeta.parentIndex) {
        return -1;
      } else {
        return 0;
      }
    }
  });
}

export function saveHighlight(param: highlightParam) {
  const data = generateServiceParams<highlightParam, highlightResponse>(param);
  return invoke("add_highlight", { data })
    .then(() => {
      message.success("添加成功");
    })
    .catch((err) => {
      message.error(err);
    });
}

export function getHighlights(bookId: string): Promise<highlightParam[]> {
  return new Promise((resolve) => {
    invoke("get_highlightes", { bookId })
      .then((value) => {
        const result = (value as highlightResponse[]).map((item) =>
          generateServiceParams<highlightResponse, highlightParam>(item, false)
        );
        console.log("result", sortHighlights(result));
        resolve(sortHighlights(result));
      })
      .catch((err) => {
        message.error(err);
        resolve([]);
      });
  });
}

export function removeHighlight(book_id: string, id: string) {
  const data = { book_id, id };
  return invoke("delete_highlight", { data })
    .then(() => {
      message.success("删除成功");
    })
    .catch((err) => {
      message.error(err);
    });
}

import { invoke } from "@tauri-apps/api";
import { message } from "../../naive";
import { highlightParam, highlightResponse } from "../notes/type";
import { generateServiceParams } from "../utils/change-name";

export function saveHighlight(param: highlightParam) {
  const data = generateServiceParams<highlightParam, highlightResponse>(param);
  invoke("add_highlight", { data })
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
        resolve(result);
      })
      .catch((err) => {
        message.error(err);
        resolve([]);
      });
  });
}

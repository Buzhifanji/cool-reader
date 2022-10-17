import { DomSource, highlightResponse } from "@/interfaces";
import { message } from "@/naive";
import { generateServiceParams } from "@/utils";
import { invoke } from "@tauri-apps/api";
import { sortNotes } from "./sort";

export function changeNotes(param: DomSource, api: string, msg: string) {
  const data = generateServiceParams<DomSource, highlightResponse>(param);
  return invoke(api, { data })
    .then(() => {
      message.success(msg);
    })
    .catch((err) => {
      message.error(err);
    });
}

export function _getNotes(bookId: string, api: string): Promise<DomSource[]> {
  return new Promise((resolve) => {
    invoke(api, { bookId })
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

export function deleteNotes(
  data: { book_id: string; id: string },
  api: string,
  isTip = true
) {
  return invoke(api, { data })
    .then(() => {
      isTip && message.success("删除成功");
    })
    .catch((err) => {
      message.error(err);
    });
}

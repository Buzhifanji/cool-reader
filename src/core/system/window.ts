import { WebviewWindow } from "@tauri-apps/api/window";
import { StorageBook } from "../type";

let index = 0;

/**
 * key 为 书本的id
 * value 为 自增的 index
 */
const windowLabel = new Map<string, string>();

export function getWiewWindow(bookId: string) {
  const label = windowLabel.get(bookId);
  if (label) {
    return WebviewWindow.getByLabel(`reader${label}`);
  }
  return null;
}

export const openReaderWindow = ({ bookName, id }: StorageBook) => {
  index += 1;
  // 处理：runtime error: Window labels must only include alphanumeric characters, `-`, `/`, `:` and `_`."
  const label = `reader${index}`;
  const readerWindow = new WebviewWindow(label, {
    url: `/reader?id=${id}`,
    title: bookName,
    width: 800,
    height: 600,
  });
  readerWindow.once("tauri://created", function (value) {
    windowLabel.set(id, index.toString());
  });
  readerWindow.once("tauri://error", function (e) {
    index -= 1;
    alert(e.payload);
  });
};

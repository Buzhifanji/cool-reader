import { BookData } from "@/interfaces";
import { WebviewWindow } from "@tauri-apps/api/window";

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

export const openReaderWindow = ({ bookName, id }: BookData) => {
  index += 1;
  // 处理：runtime error: Window labels must only include alphanumeric characters, `-`, `/`, `:` and `_`."
  const label = `reader${index}`;
  const readerWindow = new WebviewWindow(label, {
    url: `/reader?id=${encodeURIComponent(id)}`,
    title: bookName,
    center: true,
    width: 1000,
    height: 700,
  });
  readerWindow.once("tauri://created", function (value) {
    windowLabel.set(id, index.toString());
  });
  readerWindow.once("tauri://error", function (e) {
    index -= 1;
    alert(e.payload);
  });
};

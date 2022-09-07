import { forage } from "@tauri-apps/tauri-forage";
import { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
import { ref } from "vue";
import { loadPdf } from "./pdf";
import { BaseBookType } from "./type";

/**
 * 已上传的书籍列表
 */
export const books = ref<BaseBookType[]>([]);

const store = forage.createInstance({ name: "_cool_reader_" });

export async function addBook(
  book: BaseBookType,
  notification: NotificationApiInjection
) {
  const { id } = book;
  const value = await store.hasKey(id);
  if (value) {
    notification.warning({
      content: "书籍以存在",
      meta: "请不要重复添加",
      duration: 2000,
      keepAliveOnHover: true,
    });
  } else {
    store.setItem(id, book);
    books.value.unshift(book);
  }
}

export async function deleteBook(
  bookId: string,
  notification: NotificationApiInjection
) {
  const index = books.value.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.value.splice(index, 1);
  }
  await store.removeItem(bookId);
  notification.success({
    content: "删除成功！",
    meta: "66666666",
    duration: 2000,
    keepAliveOnHover: true,
  });
}

export function handleBook(file: File, fileContent: Uint8Array) {
  const fileName = file.name;
  const len = fileName.length;
  const lastIndexOfDots = fileName.lastIndexOf(".");
  const extname = fileName
    .substring(lastIndexOfDots + 1, len)
    .toLocaleLowerCase();
  const bookName = fileName.substring(0, lastIndexOfDots);
  generateBook(bookName, extname, fileContent);
}

function generateBook(
  bookName: string,
  extname: string,
  fileContent: Uint8Array
) {
  switch (extname) {
    case "pdf":
      loadPdf(fileContent);
      break;
  }
}

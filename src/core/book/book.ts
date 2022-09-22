import { ref } from "vue";
import { getPDFCover } from "../file/pdf";
import {
  addForageFile,
  deleteForageFile,
  getForageFile,
  getForageFiles,
  hasForageFile,
} from "../store/file";
import { BookInfo, StorageBook } from "../type";
import { setBookId } from "./md5";

/**
 * 已上传的书籍列表
 */
export const books = ref<StorageBook[]>([]);

export const cacheBooks = new Map<string, BookInfo>();

let isLoadStoraged = false; // 防止切换路由重复加载缓存数据

export async function initBook() {
  if (!isLoadStoraged) {
    const list = await getForageFiles();
    console.log("list", list);
    books.value = [...list];
    isLoadStoraged = true;
  }
}

export async function addBook(bookInfo: BookInfo) {
  const { bookName } = bookInfo;
  const bookId = await setBookId(bookInfo);
  const value = await hasForageFile(bookId);
  if (value) {
    window.notification.warning({
      content: "书籍已存在！",
      meta: bookName,
      duration: 2000,
      keepAliveOnHover: true,
    });
  } else {
    const cover = await generateBook(bookInfo);
    const cacheBook: StorageBook = {
      ...bookInfo,
      id: bookId,
      cover,
      category: "",
    };
    // 离线缓存
    addForageFile(cacheBook);
    // 在线缓存
    cacheBooks.set(bookId, bookInfo);
    books.value.unshift(cacheBook);
    window.notification.success({
      content: "添加成功！",
      meta: bookName,
      duration: 2000,
      keepAliveOnHover: true,
    });
  }
}

export async function deleteBook(bookId: string) {
  const index = books.value.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.value.splice(index, 1);
  }
  if (cacheBooks.has(bookId)) {
    cacheBooks.delete(bookId);
  }
  await deleteForageFile(bookId);
  window.notification.success({
    content: "删除成功！",
    meta: "66666666",
    duration: 2000,
    keepAliveOnHover: true,
  });
}

export async function openBook(id: string): Promise<BookInfo | null> {
  const book = cacheBooks.get(id);
  if (book) {
    return book;
  } else {
    return await getForageFile(id);
  }
}

function getBookContent(id: string): Uint8Array {
  let result = new Uint8Array();
  if (cacheBooks.has(id)) {
    // result = cacheBooks.get(id)!;
  } else {
    // TODO:
  }
  return result;
}

function generateBook(bookInfo: BookInfo): Promise<string> {
  const { fileContent, extname } = bookInfo;
  return new Promise(async (resolve, reject) => {
    let cover: string = "";
    switch (extname) {
      case "pdf":
        cover = await getPDFCover(fileContent);
        break;
    }
    resolve(cover);
  });
}

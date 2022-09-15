import { forage } from "@tauri-apps/tauri-forage";
import { ref } from "vue";
import { setBookId } from "./md5";
import { getPDFCover } from "./pdf";
import { bookStore } from "./storage";
import { BaseBook, BookInfo, bookType, StorageBook } from "./type";

/**
 * 已上传的书籍列表
 */
export const books = ref<StorageBook[]>([]);

export const cacheBooks = new Map<string, BookInfo>();

const store = forage.createInstance({ name: "_cool_reader_" });

export function clearStore() {
  store.clear();
}

let isLoadStoraged = false; // 防止切换路由重复加载缓存数据

export function initBook() {
  if (!isLoadStoraged) {
    store.keys().then((keys: string[]) => {
      keys.forEach(async (key: string) => {
        const value = await store.getItem(key);
        books.value.push(value);
      });
    });
    isLoadStoraged = true;
  }
}

export async function addBook(book: bookType, fileContent: Uint8Array) {
  const { id, bookName } = book;
  const value = await store.getItem(id);
  if (value) {
    window.notification.warning({
      content: "书籍已存在！",
      meta: bookName,
      duration: 2000,
      keepAliveOnHover: true,
    });
  } else {
    // await writeFile(book, fileContent);
    store.setItem(id, book);
    // books.value.unshift(book);
    window.notification.success({
      content: "添加成功！",
      meta: bookName,
      duration: 2000,
      keepAliveOnHover: true,
    });
  }
}
export async function _addBook(bookInfo: BookInfo) {
  const { bookName, extname, fileSize, fileContent } = bookInfo;
  const bookId = await setBookId(bookInfo);
  const value = await bookStore.getItem(bookId);
  if (value) {
    window.notification.warning({
      content: "书籍已存在！",
      meta: bookName,
      duration: 2000,
      keepAliveOnHover: true,
    });
  } else {
    const cover = await _generateBook(bookInfo);
    const cacheBook: StorageBook = {
      ...bookInfo,
      id: bookId,
      cover,
      category: "",
    };
    // 离线缓存
    bookStore.setItem(bookId, cacheBook);
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
  await store.removeItem(bookId);
  window.notification.success({
    content: "删除成功！",
    meta: "66666666",
    duration: 2000,
    keepAliveOnHover: true,
  });
}

export async function handleBook(file: File, fileContent: Uint8Array) {
  const { name, size } = file;
  const len = name.length;
  const lastIndexOfDots = name.lastIndexOf(".");
  const extname = name.substring(lastIndexOfDots + 1, len).toLocaleLowerCase();
  const bookName = name.substring(0, lastIndexOfDots);

  try {
    // const id = await setBookId({
    //   bookName: name,
    //   extname,
    //   fileSize: size,
    //   fileContent,
    // });
    const baseBook: BaseBook = { bookName, extname, size, id: "0" };
    const cover = await generateBook(baseBook, fileContent);
    const book: bookType = { ...baseBook, cover, author: "", category: "" };
    await addBook(book, fileContent);
  } catch (e) {
    console.log("kkkkk", e);
  }
}

export async function _handleBook(bookInfo: BookInfo) {
  const bookId = await setBookId(bookInfo);
  const cover = await _generateBook(bookInfo);
}
export function openBook(id: string) {}

function getBookContent(id: string): Uint8Array {
  let result = new Uint8Array();
  if (cacheBooks.has(id)) {
    // result = cacheBooks.get(id)!;
  } else {
    // TODO:
  }
  return result;
}

function generateBook(
  book: BaseBook,
  fileContent: Uint8Array
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let cover: string = "";
    switch (book.extname) {
      case "pdf":
        cover = await getPDFCover(fileContent);
        break;
    }
    resolve(cover);
  });
}

function _generateBook(bookInfo: BookInfo): Promise<string> {
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

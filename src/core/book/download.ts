import { open } from "@tauri-apps/api/dialog";
import { listen } from "@tauri-apps/api/event";
import { appDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { ExtnameFn } from "src/interfaces";
import { mergerUint8Array } from "src/utils";
import { todo } from "src/utils/todo";
import { getAzw3Cover } from "./azw3";
import { Bookextname } from "src/enums";
import { getEpubCover } from "./epub";
import { hasBook } from "./forage";
import { BookListItem } from "./interface";
import { setBookId } from "./md5";
import { getMobiCover } from "./mobi";
import { getPDFCover } from "./pdf";
import { useBookListStore, useDownloadFieStore } from "./store";
import { getTextCover } from "./txt";

async function getFilePath() {
  const defaultPath = await appDir();
  const selected = await open({ defaultPath });
  let result = "";
  if (Array.isArray(selected)) {
    todo('批量下载暂不支持！')
  } else if (selected === null) {
  } else {
    result = selected;
  }
  return result;
}

function handleFileName(path: string) {
  const lastIndexOfDots = path.lastIndexOf(".");
  const extname = path
    .substring(lastIndexOfDots + 1, path.length)
    .toLocaleLowerCase() as Bookextname;
  const lastIndxOfSlash = path.lastIndexOf("\\") + 1;
  const bookName = path.substring(lastIndxOfSlash, lastIndexOfDots);
  return { bookName, extname };
}

function generateBookCover({ content, extname }: BookListItem): Promise<string> {
  const BooCoverkStatus: ExtnameFn = {
    [Bookextname.pdf]: getPDFCover,
    [Bookextname.epub]: getEpubCover,
    [Bookextname.mobi]: getMobiCover,
    [Bookextname.azw3]: getAzw3Cover,
    [Bookextname.txt]: getTextCover,
  };
  return BooCoverkStatus[extname]?.(content);
}

async function cacheBook(book: BookListItem) {
  const bookId = await setBookId(book);
  const value = await hasBook(bookId);
  if (value) {
    return false
  } else {
    const cover = await generateBookCover(book);
    book.cover = cover;
    book.id = bookId;

    const store = useBookListStore();

    store.add(book)

    return true
  }
}

export function downloadFile(): Promise<{ isExit: boolean, book: BookListItem }> {
  return new Promise(async (resolve, reject) => {
    const path = await getFilePath();
    if (path) {
      const name = handleFileName(path);
      let content = new Uint8Array();
      let size = 0;
      let cahceLen = 0;
      const store = useDownloadFieStore()

      const calculatePercentage = () => {
        let progress = 0;
        if (size && cahceLen) {
          progress = Math.ceil((cahceLen / size) * 100);
        }
        store.setDownloadProgress(progress)
      }

      // 下载开始
      store.setDownloadState(true)

      invoke("download_local_file", { message: path });

      const stop = appWindow.listen("fileSize", ({ payload }) => {
        size = (payload as any).message;
      });

      const unlisten = listen("downloadLocalFileEvent", async ({ payload }) => {
        const value = payload as Uint8Array;
        cahceLen += value.length;
        if (value.length) {
          calculatePercentage();
          content = mergerUint8Array(content, new Uint8Array(value));
        } else {
          // 下载结束
          store.setDownloadState(false)
          calculatePercentage();

          // 结束 监听
          const doneSize = await stop.then();
          doneSize();

          const doneFiles = await unlisten.then();
          doneFiles();

          const book = {
            ...name,
            path,
            size,
            content,
            context: null,
            category: "",
            id: "",
            cover: "",
            chapter: "",
            catalog: [],
          };
          const isExit = await cacheBook(book)

          resolve({ isExit, book })
        }
      });
    }

    reject(`cann't find path: ${path}`)
  })
}
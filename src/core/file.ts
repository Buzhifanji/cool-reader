import { open } from "@tauri-apps/api/dialog";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { appDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { ref } from "vue";
import { addBook } from "./book";
import { BaseBook } from "./type";
import { mergerUint8Array } from "./utils";

/**
 * 因为一次只能读取一个文件，所以设定此变量，防止用户在读取中重复读取文件
 */
export const isLoadFile = ref<boolean>(false);
const setLoadFile = (value: boolean) => (isLoadFile.value = value);

const readFileSize = ref<number>(0);

async function getFilePath() {
  const selected = await open({
    defaultPath: await appDir(),
  });
  let result = "";
  if (Array.isArray(selected)) {
    // todo: 暂不支持
  } else if (selected === null) {
  } else {
    result = selected;
  }
  return result;
}

export async function openFile() {
  const path = await getFilePath();
  if (path) {
    handleFile(path);
  }
}

function downloadFile(book: BaseBook) {
  const unlisten = listFileSize();
  listenDownloadFile(book, unlisten);
  invoke("download_local_file", { message: book.path });
}

function listFileSize() {
  readFileSize.value = 0;
  return appWindow.listen("fileSize", ({ payload }) => {
    readFileSize.value = (payload as unknown as any).message;
    console.log(readFileSize.value);
  });
}

/**
 * 由于 js 从 rust 中复制 较大数据 时，非常缓慢，目前采用事情 + 切片，分批次传递方案 折中处理。
 */
function listenDownloadFile(book: BaseBook, event: Promise<UnlistenFn>) {
  let fileContent = new Uint8Array();
  setLoadFile(true);
  const unlisten = listen("downloadLocalFileEvent", ({ payload }) => {
    const arr = payload as unknown as Uint8Array;
    if (arr.length) {
      const buf = new Uint8Array(arr);
      fileContent = mergerUint8Array(fileContent, buf);
    } else {
      const bookInfo = { ...book, fileContent };
      bookInfo.fileSize = readFileSize.value;
      addBook(bookInfo).then(() => {
        setLoadFile(false);
        // 取消 监听文件大小
        event.then((done) => {
          done();
        });
        // 取消下载文件事件监听
        unlisten.then((done) => {
          done();
        });
      });
    }
  });
}

export function handleFile(path: string) {
  const name = handleFileName(path);
  const book: BaseBook = { ...name, path, fileSize: 0 };
  downloadFile(book);
}

function handleFileName(path: string) {
  const lastIndexOfDots = path.lastIndexOf(".");
  const extname = path
    .substring(lastIndexOfDots + 1, path.length)
    .toLocaleLowerCase();
  const bookName = path.substring(0, lastIndexOfDots);
  return { bookName, extname };
}

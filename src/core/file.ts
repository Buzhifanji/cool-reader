import { open } from "@tauri-apps/api/dialog";
import { appDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { ref } from "vue";
import { _addBook } from "./book";
import { BufType, _BaseBook } from "./type";
import { mergerUint8Array } from "./utils";
/**
 * 因为一次只能读取一个文件，所以设定此变量，防止用户在读取中重复读取文件
 */
export const isLoadFile = ref<boolean>(false);
const setLoadFile = (value: boolean) => (isLoadFile.value = value);

const readFileSize = ref<number>(0);

export async function openFile() {
  const selected = await open({
    defaultPath: await appDir(),
  });
  if (Array.isArray(selected)) {
    // todo: 暂不支持
  } else if (selected === null) {
    return;
  } else {
    handleFile(selected);
  }
}

function downloadFile(book: _BaseBook) {
  listenDownloadFile(book);
  readFileSize.value = 0;
  invoke("download_local_file", { window: appWindow, path: book.path }).then(
    (data) => {
      readFileSize.value = data as unknown as number;
      console.log("data", data);
    }
  );
}

/**
 * 由于 js 从 rust 中复制 较大数据 时，非常缓慢，目前采用事情 + 切片，分批次传递方案 折中处理。
 */
function listenDownloadFile(book: _BaseBook) {
  let fileContent = new Uint8Array();
  const unlisten = appWindow.listen(
    "downloadLocalFileEvent",
    ({ event, payload }) => {
      const arr = (payload as unknown as BufType).message;
      if (arr.length) {
        const buf = new Uint8Array(arr);
        fileContent = mergerUint8Array(fileContent, buf);
      } else {
        const bookInfo = { ...book, fileContent };
        bookInfo.fileSize = readFileSize.value;
        _addBook(bookInfo).then(() => {
          // 取消事件监听
          unlisten.then((done) => {
            done();
          });
        });
      }
    }
  );
}

function handleFile(path: string) {
  const name = handleFileName(path);
  const book: _BaseBook = { ...name, path, fileSize: 0 };
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

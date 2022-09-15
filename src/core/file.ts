import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, writeBinaryFile } from "@tauri-apps/api/fs";
import { appDir, downloadDir, resolveResource } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { forage } from "@tauri-apps/tauri-forage";
import { ref } from "vue";
import { handleBook, _addBook } from "./book";
import { bookType, BufType, _BaseBook } from "./type";
import { mergerUint8Array } from "./utils";
/**
 * 因为一次只能读取一个文件，所以设定此变量，防止用户在读取中重复读取文件
 */
export const isLoadFile = ref<boolean>(false);
const setLoadFile = (value: boolean) => (isLoadFile.value = value);

export function fileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const file = target.files[0];
    console.log("file", file);
    resolveResource(file.name)
      .then((value) => {
        console.log("path", value);
      })
      .catch((error) => {
        console.log("error", error);
      });
    readFile(file);
  }
}

function readFile(file: File) {
  const fileReader = new FileReader();
  const STEP = 6 * 1024 * 1024; // 以每片 6MB 大小来逐次读取
  const totalSize = file.size; // 文件总大小
  let startIndex = 0; // 当前索引
  let currentSeg = 1; // 当前分片
  let loadedSize = 0; // 已读字节数
  let buffer = new Uint8Array();

  function mergeArray(buf: ArrayBuffer) {
    const array = new Uint8Array(buf);
    const n = buffer.length + array.length;
    let result = new Uint8Array(n);
    result.set(buffer);
    result.set(array, buffer.length);
    buffer = result;
  }

  // 切片读取文件
  function seqReadFile() {
    const end = Math.min(startIndex + STEP, totalSize);
    const blob = file.slice(startIndex, end);
    startIndex = end;
    fileReader.readAsArrayBuffer(blob);
  }

  // 文件读取 结束
  fileReader.addEventListener("loadend", (ev: ProgressEvent<FileReader>) => {
    setLoadFile(true);
    if (ev.target) {
      const content = ev.target.result as ArrayBuffer;
      mergeArray(content);
      // 继续递归读取
      if (startIndex < totalSize) {
        currentSeg++;
        seqReadFile();
      } else {
        console.log("读取完毕😊✔", buffer);
        setLoadFile(false);
        handleBook(file, buffer);
      }
    } else {
      setLoadFile(false);
    }
  });

  // 文件读取 开始
  fileReader.addEventListener("loadstart", (ev: ProgressEvent<FileReader>) => {
    console.log("开始读取文件🤞");
    setLoadFile(true);
  });
  // 文件读取 错误
  fileReader.addEventListener("error", (ev: ProgressEvent<FileReader>) => {
    setLoadFile(false);
    console.warn("Error", ev);
  });
  // 文件读取 进度
  fileReader.addEventListener("progress", (ev: ProgressEvent<FileReader>) => {
    if (ev.lengthComputable) {
      loadedSize += ev.loaded;
      console.log("loadedSize", loadedSize);
    }
  });
  seqReadFile();
}

export function writeFile(book: bookType, fileContent: Uint8Array) {
  const { bookName, extname } = book;
  return writeBinaryFile(`${bookName}.${extname}`, fileContent, {
    dir: BaseDirectory.Data,
  });
}
/*------------------------- 文件存储位置  ------------------------*/
const stoargeLoction = "_tauri_storage_loction";
/**
 * 更改存储位置
 */
export async function changeStorageLoction() {
  const selectedPath = await open({
    directory: true,
    multiple: false,
    defaultPath: await getStoreageLoction(),
  });
  if (selectedPath) {
    await forage.setItem({
      key: stoargeLoction,
      value: selectedPath as string,
    });
  }
}

export async function getStoreageLoction(): Promise<string> {
  const param = { key: stoargeLoction };
  const isExite = await forage.hasKey(param)();
  return isExite ? await forage.getItem(param)() : await downloadDir();
}

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

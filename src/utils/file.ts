import { ref } from "vue";
import { handleBook } from "./book";

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
    readFile(file);
  }
}

function readFile(file: File) {
  const fileReader = new FileReader();
  const STEP = 6 * 1024 * 1024; // 分片步进
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

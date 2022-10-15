import { Bookextname } from "@/enums";
import { addBook, useLoadFile } from "@/store";
import { open } from "@tauri-apps/api/dialog";
import { listen } from "@tauri-apps/api/event";
import { appDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { mergerUint8Array } from "../utils/union";

const { setLoadFile, percentage } = useLoadFile();

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

function calculatePercentage(n: number, size: number) {
  if (size && n) {
    percentage.value = Math.ceil((n / size) * 100);
  } else {
    percentage.value = 0;
  }
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

export async function downloadFile() {
  const path = await getFilePath();
  if (path) {
    const name = handleFileName(path);
    let content = new Uint8Array();
    let size = 0;
    let cahceLen = 0;
    setLoadFile(true);

    invoke("download_local_file", { message: path });

    const stop = appWindow.listen("fileSize", ({ payload }) => {
      size = (payload as any).message;
    });

    const unlisten = listen("downloadLocalFileEvent", async ({ payload }) => {
      const value = payload as Uint8Array;
      cahceLen += value.length;
      if (value.length) {
        calculatePercentage(cahceLen, size);
        content = mergerUint8Array(content, new Uint8Array(value));
      } else {
        setLoadFile(false);
        const book = {
          ...name,
          path,
          size,
          content,
          context: null,
          category: "",
          id: "",
          cover: "",
          catalog: [],
        };
        calculatePercentage(0, size);

        await addBook(book);

        const doneSize = await stop.then();
        doneSize();

        const doneFiles = await unlisten.then();
        doneFiles();
      }
    });
  }
}

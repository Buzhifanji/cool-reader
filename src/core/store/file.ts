import { forage } from "@tauri-apps/tauri-forage";
import { StorageBook } from "../type";
import { isIndex } from "../utils/utils";

const BOOKLIST = "_tauri_book_list_";

type fileInfo = [StorageBook[], number];

/**
 * 获取 全部数据列表
 * @returns
 */
export function getForageFiles(): Promise<StorageBook[]> {
  return forage.getItem({ key: BOOKLIST })();
}

export async function getForageFile(id: string): Promise<StorageBook | null> {
  const [arr, index] = await findForageFile(id);
  if (isIndex(index)) {
    return arr[index];
  } else {
    return null;
  }
}

export async function addForageFile(file: StorageBook) {
  const [arr, index] = await findForageFile(file.id);
  if (!isIndex(index)) {
    arr.push(file);
  } else {
    const result = [file] as unknown as any;
    await forage.setItem({ key: BOOKLIST, value: result })();
  }
}

export async function deleteForageFile(id: string) {
  const [arr, index] = await findForageFile(id);
  // todo: remove
}

export async function hasForageFile(id: string) {
  const [, index] = await findForageFile(id);
  return isIndex(index);
}

async function findForageFile(id: string): Promise<fileInfo> {
  let result = -1;
  const arr = await getForageFiles();
  if (arr) {
    result = findIndex(id, arr);
  }
  return [arr, result];
}

function findIndex(id: string, arr: StorageBook[]) {
  return arr.findIndex((file) => file.id === id);
}

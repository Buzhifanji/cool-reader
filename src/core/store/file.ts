import { forage } from "@tauri-apps/tauri-forage";
import { StorageBook } from "../type";

const BOOKLIST = "_tauri_book_list_";

type fileInfo = [StorageBook[], number];

export function getForageFile(): Promise<StorageBook[]> {
  return forage.getItem({ key: BOOKLIST })();
}

export async function addForageFile(file: StorageBook) {
  const [arr, index] = await findForageFile(file.id);
  if (index !== -1) {
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
  return index !== -1;
}

async function findForageFile(id: string): Promise<fileInfo> {
  let result = -1;
  const arr = await getForageFile();
  if (arr) {
    result = findIndex(id, arr);
  }
  return [arr, result];
}

function findIndex(id: string, arr: StorageBook[]) {
  return arr.findIndex((file) => file.id === id);
}

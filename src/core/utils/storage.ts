import { open } from "@tauri-apps/api/dialog";
import { downloadDir } from "@tauri-apps/api/path";
import { forage } from "@tauri-apps/tauri-forage";
import { books } from "../book/book";

/**
 * 本地缓存
 */

const storageLoction = "_tauri_storage_loction";

export const bookStore = forage.createInstance({ name: "_cool_reader_" });

export function clearStore() {
  bookStore.clear();
  books.value = [];
}

export async function changeStorageLoction() {
  const selectedPath = await open({
    directory: true,
    multiple: false,
    defaultPath: await getStoreageLoction(),
  });
  if (selectedPath) {
    await forage.setItem({
      key: storageLoction,
      value: selectedPath as string,
    });
  }
}

export async function getStoreageLoction(): Promise<string> {
  const param = { key: storageLoction };
  const isExite = await forage.hasKey(param)();
  return isExite ? await forage.getItem(param)() : await downloadDir();
}

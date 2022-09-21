import { ref } from "vue";
import { getBookCatalog } from "./book";

export enum TabPaneEnum {
  catalog,
  bookmark,
  note,
  highlight,
}

interface TabPane {
  tab: string;
  name: TabPaneEnum;
}

export const tabPanes = ref<TabPane[]>([
  { name: TabPaneEnum.catalog, tab: "目录" },
  { name: TabPaneEnum.bookmark, tab: "书签" },
  { name: TabPaneEnum.note, tab: "笔记" },
  { name: TabPaneEnum.highlight, tab: "高亮" },
]);

export const activeTabRef = ref<TabPaneEnum>(TabPaneEnum.catalog);

export function changePane(name: TabPaneEnum) {
  switch (name) {
    case TabPaneEnum.catalog:
      getBookCatalog();
      break;
  }
}

export function isActiveTab(tab: TabPaneEnum): boolean {
  return tab === activeTabRef.value;
}

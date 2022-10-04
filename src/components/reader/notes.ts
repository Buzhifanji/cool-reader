import { ref } from "vue";
import { TabPaneEnum } from "./enum";
import { TabPane } from "./type";

const showNotes = ref<boolean>(false);

export const useNotesSection = () => {
  const notesActiveTab = ref<TabPaneEnum>(TabPaneEnum.catalog);
  const tabPanes: TabPane[] = [
    { name: TabPaneEnum.catalog, tab: "目录" },
    { name: TabPaneEnum.bookmark, tab: "书签" },
    { name: TabPaneEnum.note, tab: "笔记" },
    { name: TabPaneEnum.highlight, tab: "高亮" },
  ];
  function isNotesTab(tab: TabPaneEnum): boolean {
    return tab === notesActiveTab.value;
  }
  return {
    showNotes,
    notesActiveTab,
    controlNodesSection,
    tabPanes,
    isNotesTab,
  };
};

export function controlNodesSection(value: boolean) {
  showNotes.value = value;
}

import { TabPaneEnum } from "@/enums";
import { ref } from "vue";

export const useNotesSection = () => {
  const notesActiveTab = ref<TabPaneEnum>(TabPaneEnum.catalog);
  const showNotes = ref<boolean>(false);

  const tabPanes = [
    { name: TabPaneEnum.catalog, tab: "目录" },
    { name: TabPaneEnum.bookmark, tab: "书签" },
    { name: TabPaneEnum.notes, tab: "笔记" },
    { name: TabPaneEnum.highlight, tab: "高亮" },
  ];
  function isNotesTab(tab: TabPaneEnum): boolean {
    return tab === notesActiveTab.value;
  }
  function controlNodesSection(value: boolean) {
    if (showNotes.value !== value) {
      showNotes.value = value;
    }
  }
  return {
    showNotes,
    notesActiveTab,
    controlNodesSection,
    tabPanes,
    isNotesTab,
  };
};

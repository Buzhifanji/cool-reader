import { TabPaneEnum } from "src/enums";

export const useNotesSection = () => {
  const notesActiveTab = ref<TabPaneEnum>(TabPaneEnum.notes);
  const showNotes = ref<boolean>(false);
  const notesWidth = 312;
  onMounted(() => (showNotes.value = true));

  onKeyStroke(["n", "N"], (e) => {
    e.preventDefault();
    showNotes.value = !showNotes.value;
  });

  const tabPanes = [
    // { name: TabPaneEnum.catalog, tab: "目录" },
    { name: TabPaneEnum.notes, tab: "笔记" },
    { name: TabPaneEnum.highlight, tab: "高亮" },
    { name: TabPaneEnum.bookmark, tab: "书签" },
  ];
  function isNotesTab(tab: TabPaneEnum): boolean {
    return tab === notesActiveTab.value;
  }

  return {
    showNotes,
    notesActiveTab,
    tabPanes,
    isNotesTab,
    notesWidth,
  };
};

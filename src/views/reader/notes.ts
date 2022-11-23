import { TabPaneEnum } from "src/enums";
import Idea from 'src/components/idea/idea.vue'
import Highlight from 'src/components/highlight/highlight.vue'
// import Bookmark from 'src/components/bookmark/bookmark.vue'

export const useNotesSection = () => {
  const notesActiveTab = ref<TabPaneEnum>(TabPaneEnum.idea);
  const showNotes = ref<boolean>(false);
  const notesWidth = 312;

  const components = {
    [TabPaneEnum.idea]: Idea,
    [TabPaneEnum.highlight]: Highlight,
    // [TabPaneEnum.bookmark]: Bookmark,
  }

  onMounted(() => {
    showNotes.value = true
  });

  onKeyStroke(["n", "N"], (e) => {
    e.preventDefault();
    showNotes.value = !showNotes.value;
  });

  const tabPanes = [
    // { name: TabPaneEnum.catalog, tab: "目录" },
    { name: TabPaneEnum.idea, tab: "笔记" },
    { name: TabPaneEnum.highlight, tab: "高亮" },
    // { name: TabPaneEnum.bookmark, tab: "书签" },
  ];

  return {
    showNotes,
    notesActiveTab,
    components,
    tabPanes,
    notesWidth,
  };
};

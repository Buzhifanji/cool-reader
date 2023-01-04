import { RouterName, TabPaneEnum } from "src/enums";
import Idea from './idea/index.vue'
import Highlight from './highlight/index.vue'
import { langField } from "src/i18n";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";
import { bookRender, catalogJump, useReadBookStore } from "src/core/book";
import { useBookNotesStore } from "src/store";
import { Bookextname } from "src/enums";
import { config } from "src/config";
import { OPEN_NOTES } from "src/constants";

export const useHandleCatalog = () => {
  const showCatalog = ref<boolean>(false);
  const catalogWidth = 294;
  onMounted(() => (showCatalog.value = true));

  const stopCatalog = onKeyStroke(["m", "M"], (e) => {
    e.preventDefault();
    showCatalog.value = !showCatalog.value;
  });

  onUnmounted(() => {
    stopCatalog();
  })

  return { showCatalog, catalogWidth };
}

export const useHandleNotes = () => {
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

  const { notes, highlight } = langField.value;
  const tabPanes = [
    // { name: TabPaneEnum.catalog, tab: "目录" },
    { name: TabPaneEnum.idea, tab: notes },
    { name: TabPaneEnum.highlight, tab: highlight },
    // { name: TabPaneEnum.bookmark, tab: "书签" },
  ];

  return {
    showNotes,
    notesActiveTab,
    components,
    tabPanes,
    notesWidth,
  };
}

export const useHandleHelp = () => {
  const showHelp = ref<boolean>(false)

  const stopHelp = onKeyStroke(["h", "H"], (e) => {
    e.preventDefault();
    showHelp.value = !showHelp.value;
  });
  const { shortcutKey, catalogShortcutKey, notesShortcutKey, stopReading } = langField.value;
  const helpList = ref([
    {
      title: shortcutKey,
      list: [
        { name: 'M / m', value: catalogShortcutKey },
        { name: 'N / n', value: notesShortcutKey },
      ]
    }
  ])

  if (!config.multiWindow) {
    helpList.value[0].list.push({ name: 'Esc', value: stopReading })
  }

  onUnmounted(() => {
    stopHelp()
  })

  return { showHelp, helpList, }
}

export const useHandleReading = async (route: RouteLocationNormalizedLoaded) => {
  const id = route.query.id as string;

  // 此处很重要（解析 azw3、mobi、txt等格式的时候，用的上)
  useTitle('Cool do Reader')

  await bookRender(id)

  useBookNotesStore().getBookNotes();

  const notes = localStorage.getItem(OPEN_NOTES)
  if (notes) {
    const { jumpByChapter } = useHandleCatalogJump();
    jumpByChapter(JSON.parse(notes).chapter);
    localStorage.removeItem(OPEN_NOTES)
  }
}

export const useHandleCatalogJump = () => {
  function getCatalogFieldKey() {
    const bookStore = useReadBookStore();
    switch (bookStore.readingBook.extname) {
      case Bookextname.pdf:
        return ["title", "items"];
      case Bookextname.epub:
      case Bookextname.mobi:
      case Bookextname.azw3:
      case Bookextname.txt:
        return ["label", "subitems"];
      default:
        console.warn("TODO: Unknown readingBook.chilren key: " + bookStore.readingBook.extname);
        return ["label", "children"];
    }
  }

  function getCurrentBookCatalog(key?: string) {
    const [label, childrenField] = getCatalogFieldKey();
    const { chapter, catalog } = useReadBookStore().readingBook

    const chapterKey = key ? key : chapter
    const stack = [...catalog]

    let cur = catalog[0];

    while (cur = stack.pop()) {
      if (cur[label] === chapterKey) {
        break
      }
      const children = cur[childrenField]
      for (let i = 0; i < children.length; i++) {
        stack.push(children[i])
      }
    }

    return cur
  }

  // 直接点击目录跳转
  function jump(item: any) {
    const bookStore = useReadBookStore();
    switch (bookStore.readingBook.extname) {
      case Bookextname.pdf:
        return catalogJump(item.dest)
      case Bookextname.epub:
        return catalogJump(item.href)
      case Bookextname.mobi:
        return catalogJump(item.label)
      case Bookextname.azw3:
        return catalogJump(item.label)
      case Bookextname.txt:
        return catalogJump(item.label)
      default:
        console.warn("TODO: Unknown readingBook.extname");
    }
  }

  // 点击笔记 记录的章节，跳转
  async function jumpByChapter(chapter: string) {
    const chapterData = getCurrentBookCatalog(chapter);
    await jump(chapterData)
    const bookStore = useReadBookStore();
    bookStore.update({ chapter })
  }

  return { jumpByChapter, jump }
}

export const useCloseReader = (router: Router) => {
  const stopClose = onKeyStroke(['Escape'], (e) => {
    if (!config.multiWindow) {
      e.preventDefault();
      router.push({ name: RouterName.books, })
    }
  });

  onUnmounted(() => {
    stopClose();
  })
}
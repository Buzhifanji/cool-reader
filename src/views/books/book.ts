import { BookData } from "src/interfaces";
import { notification } from "src/naive";
import { getAllBooks, removeBook } from "src/store";
import { isIndex, renderIcon } from "src/utils";
import { Delete, Edit, Export } from "@vicons/carbon";

const books = ref<BookData[]>([]);

export function deleteBook(bookId: string) {
  const index = books.value.findIndex((book) => book.id === bookId);
  if (isIndex(index)) {
    const name = books.value[index].bookName;
    books.value.splice(index, 1);
    notification.success({
      content: "删除成功！",
      meta: name,
      duration: 2000,
      keepAliveOnHover: true,
    });
  }
}

export function updateBook(book: BookData) {
  books.value.unshift(book);
}

// 右键
export const useContextMenu = () => {
  const showDropdownRef = ref<boolean>(false);
  const xRef = ref<number>(0);
  const yRef = ref<number>(0);

  let selectedBookId: string | null = null;

  const enum menusKey {
    delete,
    edit,
    export,
  }

  const menus = [
    {
      label: "删除",
      key: menusKey.delete,
      icon: renderIcon(Delete),
    },
    {
      label: "编辑",
      key: menusKey.edit,
      icon: renderIcon(Edit),
    },
    {
      label: "导出",
      key: menusKey.export,
      icon: renderIcon(Export),
    },
  ];

  function handleSelect(key: menusKey) {
    showDropdownRef.value = false;
    switch (key) {
      case menusKey.delete:
        deleteBook(selectedBookId!);
        removeBook(selectedBookId!);
        break;
    }
  }
  function handleContextMenu(e: MouseEvent, id: string) {
    e.preventDefault();
    showDropdownRef.value = false;
    nextTick().then(() => {
      selectedBookId = id;
      showDropdownRef.value = true;
      xRef.value = e.clientX;
      yRef.value = e.clientY;
    });
  }
  function onClickOutside() {
    showDropdownRef.value = false;
  }

  return {
    showDropdownRef,
    xRef,
    yRef,
    handleSelect,
    handleContextMenu,
    onClickOutside,
    menus,
  };
};

let isLoadStoraged = false; // 防止切换路由重复加载缓存数据

export const useBooks = () => {
  async function initBook() {
    if (!isLoadStoraged) {
      const list = await getAllBooks();
      books.value = list ? [...list] : [];
      isLoadStoraged = true;
    }
  }
  initBook();
  return { books };
};

import { notification } from "@/naive";
import { deleteForageFile, getForageFiles } from "@core/store";
import { StorageBook } from "@core/type";
import { renderIcon } from "@core/utils/dom";
import { isIndex } from "@core/utils/is";
import { Delete, Edit, Export } from "@vicons/carbon";
import { nextTick, ref } from "vue";

const books = ref<StorageBook[]>([]);

function deleteBookList(bookId: string) {
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

export function updateBook(book: StorageBook) {
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
        deleteBookList(selectedBookId!);
        deleteForageFile(selectedBookId!);
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
  function onClickoutside() {
    showDropdownRef.value = false;
  }

  return {
    showDropdownRef,
    xRef,
    yRef,
    handleSelect,
    handleContextMenu,
    onClickoutside,
    menus,
  };
};

let isLoadStoraged = false; // 防止切换路由重复加载缓存数据

export const useBooks = () => {
  async function initBook() {
    if (!isLoadStoraged) {
      const list = await getForageFiles();
      books.value = list ? [...list] : [];
      isLoadStoraged = true;
    }
  }
  initBook();
  return { books };
};

import { BookData } from "src/interfaces";
import { notification } from "src/naive";
import { isIndex, renderIcon } from "src/utils";
import { Delete, Edit, Export } from "@vicons/carbon";
import { getAllBooks, removeBook } from "src/core/book/forage";

const books = ref<BookData[]>([]);

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

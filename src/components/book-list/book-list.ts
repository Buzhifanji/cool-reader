import { Delete, Edit, Export } from "@vicons/carbon";
import { nextTick, ref } from "vue";
import { renderIcon } from "../../core/utils/utils";
// 右键
export const useContextMenu = () => {
  const showDropdownRef = ref<boolean>(false);
  const xRef = ref<number>(0);
  const yRef = ref<number>(0);

  const menus = [
    {
      label: "删除",
      key: "1",
      icon: renderIcon(Delete),
    },
    {
      label: "编辑",
      key: "5",
      icon: renderIcon(Edit),
    },
    {
      label: "导出",
      key: "10",
      icon: renderIcon(Export),
    },
  ];

  function handleSelect(key: string | number) {
    showDropdownRef.value = false;
  }
  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    showDropdownRef.value = false;
    nextTick().then(() => {
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

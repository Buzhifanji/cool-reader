import { Copy, TextHighlight, TextUnderline } from "@vicons/carbon";
import { reactive, ref } from "vue";

const toolBarActive = ref<boolean>(false);
const toolBarRef = ref<HTMLElement | null>(null);
const toolBarStyle = reactive({
  left: "0",
  top: "0",
});

// 控制 显示 tool-bar 已经显示位置
export const useControlToolBar = () => {
  return { toolBarStyle, toolBarRef, toolBarActive };
};

export function onToolBarActive(value: boolean) {
  toolBarActive.value = value;
}

export const useToolBar = () => {
  const enum barEnum {
    Copy,
    TextUnderline,
    TextHighlight,
  }
  const bars = [
    {
      label: "复制",
      key: barEnum.Copy,
      icon: Copy,
    },
    {
      label: "下划线",
      key: barEnum.TextUnderline,
      icon: TextUnderline,
    },
    {
      label: "高亮",
      key: barEnum.TextHighlight,
      icon: TextHighlight,
    },
  ];

  function barAction(key: barEnum) {
    switch (key) {
      case barEnum.Copy:
        break;
      case barEnum.TextUnderline:
        break;
      case barEnum.TextHighlight:
        break;
    }
  }
  return { bars, barAction };
};

export function handleToolBar(node: HTMLElement, id: string) {
  onToolBarActive(true);
  setToolBarAttr(node, id);
}

function setToolBarAttr(node: HTMLElement, id: string) {
  const { top, left } = getPosition(node);
  toolBarStyle.left = `${left - 20}px`;
  toolBarStyle.top = `${top - 25}px`;
  toolBarRef.value!.setAttribute("data-id", id);
}

function getPosition(node: HTMLElement) {
  let offset = { top: 0, left: 0 };
  while (node) {
    offset.top += node.offsetTop;
    offset.left += node.offsetLeft;
    node = node.offsetParent as HTMLElement;
    if (node.id === "viewerContainer") {
      break;
    }
  }
  return offset;
}

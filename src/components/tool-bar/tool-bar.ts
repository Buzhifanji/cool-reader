import { Copy, TextHighlight, TextUnderline } from "@vicons/carbon";
import { reactive } from "vue";

const toolBarStyle = reactive({
  left: "0",
  top: "0",
});

const toolBar = reactive({
  id: "",
  show: false,
});

export function closeToolBar() {
  toolBar.show = false;
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
  return { bars, barAction, toolBarStyle, toolBar };
};

export function handleToolBar(node: HTMLElement, id: string) {
  const { top, left } = getPosition(node);
  toolBarStyle.left = `${left - 20}px`;
  toolBarStyle.top = `${top - 25}px`;
  toolBar.show = true;
  toolBar.id = id;
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

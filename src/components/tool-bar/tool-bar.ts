import { Copy, TextHighlight, TextUnderline } from "@vicons/carbon";
import { reactive } from "vue";
import Highlighter from "web-highlighter";

// 工具栏 显示的位置
const toolBarStyle = reactive({
  left: "0",
  top: "0",
});

const toolBar = reactive({
  id: "", // 绑定数据的 id （Highlighter每创建一条数据都有一个id）
  show: false,
});

export function showToolBar(value: boolean) {
  toolBar.show = value;
}

export function removeCachedToolBar(highlighter: Highlighter) {
  if (toolBar.show) {
    highlighter.removeClass("highlight-mengshou-wrap", toolBar.id);
    highlighter.remove(toolBar.id);
  }
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
  toolBar.id = id;
  toolBar.show = true;
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

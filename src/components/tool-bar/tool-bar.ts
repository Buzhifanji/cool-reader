import { Copy, TextHighlight, TextUnderline } from "@vicons/carbon";
import { reactive } from "vue";
import { useReaderToolBar } from "../../core/notes/reader-tool";
import { message } from "../../naive";
import { ToolBar, ToolBarStyle } from "./interface";

function toolBarStyleModel(): ToolBarStyle {
  return {
    left: "0",
    top: "0",
  };
}

function toolBarModel(): ToolBar {
  return {
    id: "", // 绑定数据的 id （Highlighter每创建一条数据都有一个id）
    show: false,
    save: false,
    source: null,
  };
}

// 工具栏 显示的位置
export const toolBarStyle = reactive<ToolBarStyle>(toolBarStyleModel());

export const toolBar = reactive<ToolBar>(toolBarModel());

export function resetToolBar() {
  Object.assign(toolBarStyle, toolBarStyleModel());
  Object.assign(toolBar, toolBarModel());
}

export const useToolBar = () => {
  const enum barEnum {
    Copy,
    TextHighlight,
    tilde,
    straightLine,
  }
  const bars = [
    {
      label: "复制",
      key: barEnum.Copy,
      icon: Copy,
    },
    {
      label: "高亮",
      key: barEnum.TextHighlight,
      icon: TextHighlight,
    },
    {
      label: "波浪线",
      key: barEnum.tilde,
      icon: TextUnderline,
    },
    {
      label: "直线",
      key: barEnum.straightLine,
      icon: TextUnderline,
    },
  ];
  const { addTextHighlight, addTilde, addStraightLine } = useReaderToolBar();
  const barActionStatus: Record<barEnum, Function> = {
    [barEnum.Copy]: copyText,
    [barEnum.TextHighlight]: addTextHighlight,
    [barEnum.tilde]: addTilde,
    [barEnum.straightLine]: addStraightLine,
  };
  function barAction(key: barEnum) {
    barActionStatus[key]();
  }
  return { bars, barAction, toolBarStyle, toolBar };
};

function copyText() {
  if (navigator.clipboard && toolBar.source) {
    navigator.clipboard.writeText(toolBar.source.text).then(() => {
      message.success("复制成功！");
    });
  } else {
    // 兼容性
  }
}

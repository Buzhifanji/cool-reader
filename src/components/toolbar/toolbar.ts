import { Copy, Delete, TextHighlight, TextUnderline } from "@vicons/carbon";
import { computed, reactive } from "vue";
import { useRemoveHighlight } from "../../core/notes/toobar";
import { saveHighlight } from "../../core/service/highlight";
import { domSourceFromRange } from "../../core/toolbar";
import { message } from "../../naive";
import { updateHighlights } from "../highlight/highlight";
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
    remove: false,
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
    remove,
  }
  const list = [
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
  const bars = computed(() => {
    if (toolBar.remove) {
      const editer = { label: "删除", key: barEnum.remove, icon: Delete };
      return [...list, editer];
    } else {
      return [...list];
    }
  });
  function save(className?: string) {
    toolBar.show = false;
    toolBar.save = true;
    const source = toolBar.source;
    if (source) {
      if (className) {
        source.className = className;
      }
      if (domSourceFromRange(source)) {
        saveHighlight(source).then(() => updateHighlights());
      }
    }
  }
  // 高亮
  function addTextHighlight() {
    save();
  }
  // 波浪线
  function addTilde() {
    save("c-tilde");
  }
  // 直线
  function addStraightLine() {
    save("c-straight-line");
  }
  function remove() {
    const { bookId, id } = toolBar.source!;
    useRemoveHighlight(bookId, id);
  }
  const barActionStatus: Record<barEnum, Function> = {
    [barEnum.Copy]: copyText,
    [barEnum.TextHighlight]: addTextHighlight,
    [barEnum.tilde]: addTilde,
    [barEnum.straightLine]: addStraightLine,
    [barEnum.remove]: remove,
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

import {
  Copy,
  Delete,
  Idea,
  TextHighlight,
  TextUnderline,
} from "@vicons/carbon";
import { computed, reactive, ref } from "vue";
import { useRemoveHighlight } from "../../core/notes/toobar";
import { saveHighlight, updateHighlight } from "../../core/service/highlight";
import { domSourceFromRange } from "../../core/toolbar";
import { updateDomSource } from "../../core/toolbar/source";
import { DEFAULT_DOM_CLASS_NAME } from "../../core/utils/constant";
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
    source: null,
    edit: false,
    input: false,
  };
}

// 工具栏 显示的位置
export const toolBarStyle = reactive<ToolBarStyle>(toolBarStyleModel());

export const toolBar = reactive<ToolBar>(toolBarModel());

enum barEnum {
  Copy,
  TextHighlight,
  tilde,
  straightLine,
  edit,
  idea,
}

export function resetToolBar() {
  Object.assign(toolBarStyle, toolBarStyleModel());
  Object.assign(toolBar, toolBarModel());
}

export const useToolBar = () => {
  const ideaValue = ref<string>("");
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
    {
      label: "笔记",
      key: barEnum.idea,
      icon: Idea,
    },
  ];
  const bars = computed(() => {
    if (toolBar.edit) {
      const editer = { label: "删除", key: barEnum.edit, icon: Delete };
      return [...list, editer];
    } else {
      return [...list];
    }
  });

  function action(className: string) {
    const source = toolBar.source;
    if (source) {
      const oldClassName = source.className;
      source.className = className;
      if (toolBar.edit) {
        // 更新 高亮笔记类型
        if (oldClassName !== className) {
          updateHighlight(source).then(() => {
            updateDomSource(source, oldClassName);
            updateHighlights();
          });
        }
      } else {
        // 新增高亮笔记
        resetToolBar();
        const { result, deleteIds } = domSourceFromRange(source);
        if (result) {
          saveHighlight(source).then(() => updateHighlights());
          deleteIds.forEach((id) => {
            useRemoveHighlight(id, false);
          });
        }
      }
    }
  }
  // 高亮
  function addTextHighlight() {
    action(DEFAULT_DOM_CLASS_NAME);
  }
  // 波浪线
  function addTilde() {
    action("c-tilde");
  }
  // 直线
  function addStraightLine() {
    action("c-straight-line");
  }
  function remove() {
    useRemoveHighlight(toolBar.source!.id);
  }
  function ideaInput() {
    toolBar.input = true;
  }
  const barActionStatus: Record<barEnum, Function> = {
    [barEnum.Copy]: copyText,
    [barEnum.TextHighlight]: addTextHighlight,
    [barEnum.tilde]: addTilde,
    [barEnum.straightLine]: addStraightLine,
    [barEnum.edit]: remove,
    [barEnum.idea]: ideaInput,
  };
  function barAction(key: barEnum) {
    barActionStatus[key]();
  }
  return { bars, barAction, toolBarStyle, toolBar, ideaValue };
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

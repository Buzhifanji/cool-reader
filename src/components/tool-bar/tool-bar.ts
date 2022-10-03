import { Copy, TextHighlight, TextUnderline } from "@vicons/carbon";
import { reactive } from "vue";

// 工具栏 显示的位置
export const toolBarStyle = reactive({
  left: "0",
  top: "0",
});

export const toolBar = reactive({
  id: "", // 绑定数据的 id （Highlighter每创建一条数据都有一个id）
  show: false,
  save: false,
});

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

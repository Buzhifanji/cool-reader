import { Copy, TextHighlight, TextUnderline } from "@vicons/carbon";
import { reactive } from "vue";
import HighlightSource from "web-highlighter/dist/model/source";
import { useReaderToolBar } from "../../core/notes/reader-tool";
import { message } from "../../naive";

// 工具栏 显示的位置
export const toolBarStyle = reactive({
  left: "0",
  top: "0",
});

export const toolBar = reactive<{
  id: string;
  show: boolean;
  save: boolean;
  source: null | HighlightSource;
}>({
  id: "", // 绑定数据的 id （Highlighter每创建一条数据都有一个id）
  show: false,
  save: false,
  source: null,
});

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
  function barAction(key: barEnum) {
    switch (key) {
      case barEnum.Copy:
        copyText();
        break;
      case barEnum.TextHighlight:
        addTextHighlight();
        break;
      case barEnum.tilde:
        addTilde();
        break;
      case barEnum.straightLine:
        addStraightLine();
        break;
    }
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

import HighlightSource from "web-highlighter/dist/model/source";

export interface ToolBarStyle {
  left: string;
  top: string;
}

export interface ToolBar {
  id: string;
  show: boolean;
  save: boolean;
  source: null | HighlightSource;
}

import { DomSource } from "../../core/toolbar/type";

export interface ToolBarStyle {
  left: string;
  top: string;
}

export interface ToolBar {
  id: string;
  show: boolean;
  save: boolean;
  remove: boolean;
  source: null | DomSource;
}

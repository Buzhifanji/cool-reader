import { DomSource } from "../store";

export interface ToolBar {
  id: string;
  show: boolean;
  edit: boolean;
  source: null | DomSource;
}

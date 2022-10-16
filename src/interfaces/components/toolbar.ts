import { DomSource } from "../store";

export interface ToolBar {
  id: string;
  show: boolean;
  edit: boolean;
  input: boolean;
  source: null | DomSource;
}

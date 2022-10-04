import { TabPaneEnum } from "./enum";

export type HEvent = MouseEvent | TouchEvent;
export interface HData {
  id: string;
}

export interface TabPane {
  tab: string;
  name: TabPaneEnum;
}

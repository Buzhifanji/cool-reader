import { Bookextname } from "../../core/utils/enums";
import { TabPaneEnum } from "./enum";

export type HEvent = MouseEvent | TouchEvent;
export interface HData {
  id: string;
}

export interface TabPane {
  tab: string;
  name: TabPaneEnum;
}

export type PageTurnStatues = Record<Bookextname, Function>;

// export interface PageTurnStatues {
//   [key as Bookextname]: Function;
// }

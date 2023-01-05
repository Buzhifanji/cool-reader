import { DATA_SOURCE_ID, NOTES_ID, NOTES_LINE_CLASS_NAME } from "src/constants";
import { Notes } from "src/core/web-highlight";

export const isArray = (value: any) => Array.isArray(value);
export const arrayHasData = (value: any[]) => arrayHasData.length > 0;
export const isObj = (value: any) =>
  Object.prototype.toString.call(value) === "[object Object]";

export const isStr = (value: unknown) => typeof value === "string";

export const isOwn = (obj: Object, key: string) => obj.hasOwnProperty(key);
export const isIndex = (index: number) => index !== -1;
export const isTextNode = (node: Text): boolean =>
  node.nodeType === Node.TEXT_NODE;

export const isElementNode = (node: HTMLElement): boolean =>
  node.nodeType === Node.ELEMENT_NODE;

export const isObjEqual = <T extends object>(x: T, y: T) => {
  if (x === y) {
    return true;
  } else if (isObj(x) && isObj(y)) {
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }
    for (let key in x) {
      if (y.hasOwnProperty(key)) {
        if (!isObjEqual(x[key] as object, y[key] as object)) return false;
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};


export const hasNotes = (node: HTMLElement): boolean =>
  node.hasAttribute(NOTES_ID);
export const hasHighlight = (node: HTMLElement): boolean =>
  node.hasAttribute(DATA_SOURCE_ID);

export const isEndsWith = (str: string, value: string): boolean =>
  str.endsWith(value);

export const isHightlight = (value: Notes) => value.content.length === 0;

export const isIdea = (value: Notes) => value.content.length > 0;
import { WebHighlightOptions } from "./interface";

export const DATA_WEB_HIGHLIGHT = "data-web-highlight_id";
export const DATA_WEB_HIGHLIGHT_TYPE = "data-web-highlight_type";

export const ROOT_INDEX = -2;
export const UNKNOWN_INDEX = -1;

const DEFAULT_WRAP_TAG = 'i';

export const getDefaultOptions = (): WebHighlightOptions => {
  return {
    context: window,
    root: document,
    tagName: DEFAULT_WRAP_TAG,
    isMerge: false,
    className: 'highlight-wrapper_default'
  }
}
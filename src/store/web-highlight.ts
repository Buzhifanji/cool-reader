import { DomSource, WebHighlight, WebHighlightOptions } from "src/core/web-highlight";

let webHighlight: WebHighlight | null = null;


export function initWebHighlight(option: WebHighlightOptions) {
  webHighlight = new WebHighlight(option);
}

export function getWebHighlight(): WebHighlight {
  return webHighlight;
}

export function removeWebHighlight(id: string) {
  return webHighlight.removeDom(id)
}

export function paintHighlight(domSource: DomSource[] | DomSource) {
  if (webHighlight) {
    webHighlight.source(domSource)
  }
}
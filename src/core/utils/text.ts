import { createEle } from "./dom";

export const getTextWidth = (dom: HTMLElement, text: string) => {
  const cavans = createEle("canvas") as HTMLCanvasElement;
  const context = cavans.getContext("2d")!;
  context.font = window.getComputedStyle(dom).font;
  const metrics = context.measureText(text);
  return metrics.width;
};

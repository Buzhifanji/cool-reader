import { IFRAME_DEAULT_STYLE, VIEWER } from "src/constants";
import { getEleById, getIframeDoc } from "src/utils";

function getDeaultCss() {
  const colors = ["#FBF1D1", "#EFEEB0", "#CAEFC9", "#76BEE9"];
  const lines = ["#FF0000", "#000080", "#0000FF", "#2EFF2E"];
  return `::selection{background:#f3a6a68c}
  ::-moz-selection{background:#f3a6a68c}
  [class*=color-]:hover{cursor:pointer;background-image:linear-gradient(0,rgba(0,0,0,.075),rgba(0,0,0,.075))}
  .color-0{background-color:${colors[0]}}
  .color-1{background-color:${colors[1]}}
  .color-2{background-color:${colors[2]}}
  .color-3{background-color:${colors[3]}}
  .line-0{border-bottom:2px solid ${lines[0]}}
  .line-1{border-bottom:2px solid ${lines[1]}}
  .line-2{border-bottom:2px solid ${lines[2]}}
  .line-3{border-bottom:2px solid ${lines[3]}}}
  img{max-width:100% !important}`;
}

export function addIframeDeaultCss() {
  const doc = getIframeDoc();

  if (!doc) return;
  if (!doc.head) return;

  const css = getDeaultCss();
  const style = doc.createElement('style');

  style.id = IFRAME_DEAULT_STYLE
  style.textContent = css;
  doc.head.appendChild(style);
}

export function setViewerStle() {
  const contianer = getEleById(VIEWER)!;
  contianer.setAttribute('style', `max-width:800px; margin: 0 auto`)
}
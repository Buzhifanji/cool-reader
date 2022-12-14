import { KookitRender } from "./Kookit";
import chardet from "chardet";

let rendition: any = null;

export async function renderText(content: Uint8Array) {
  const charset = chardet.detect(content) || 'utf8'// 获取文本编码
  rendition = new KookitRender({ content, renderName: 'TxtRender', charset })
  await rendition.action()
}

export function getTextCover() {
  console.log('todo: getTextCover')
}

export function useTextChangePage() {
  function textJumpFromCatalog(href: string) {
    rendition.jump(href);
  }
  function textPageUp() {
    rendition.prev();
  }
  function textPageDown() {
    rendition.next();
  }

  return { textJumpFromCatalog, textPageUp, textPageDown }
}

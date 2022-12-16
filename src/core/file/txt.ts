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
    return rendition.jump(href);
  }
  function textPageUp() {
    return rendition.prev();
  }
  function textPageDown() {
    return rendition.next();
  }

  return { textJumpFromCatalog, textPageUp, textPageDown }
}

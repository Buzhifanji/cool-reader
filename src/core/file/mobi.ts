import { KookitRender } from "./Kookit";

let rendition: any = null;

export async function renderMobi(content: Uint8Array) {
  rendition = new KookitRender({ content, renderName: 'MobiRender' })
  await rendition.action()
}

export function getMobiCover() {
  console.log('todo: getEpubCover')
}


export function useMobiChangePage() {
  function mobiJumpFromCatalog(href: string) {
    rendition.jump(href);
  }
  function mobiPageUp() {
    rendition.prev();
  }
  function mobiPageDown() {
    rendition.next();
  }

  return { mobiJumpFromCatalog, mobiPageUp, mobiPageDown }
}
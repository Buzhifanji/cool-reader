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
    return rendition.jump(href);
  }
  function mobiPageUp() {
    return rendition.prev();
  }
  function mobiPageDown() {
    return rendition.next();
  }

  return { mobiJumpFromCatalog, mobiPageUp, mobiPageDown }
}
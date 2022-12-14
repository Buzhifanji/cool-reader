import { KookitRender } from "./Kookit";

let rendition: any = null;

export async function renderAzw3(content: Uint8Array) {
  rendition = new KookitRender({ content, renderName: 'Azw3Render' })
  await rendition.action()
}

export function getAzw3Cover() {
  console.log('todo: getEpubCover')
}

export function useAzw3ChangePage() {
  function azw3JumpFromCatalog(href: string) {
    rendition.jump(href);
  }
  function azw3PageUp() {
    rendition.prev();
  }
  function azw3PageDown() {
    rendition.next();
  }

  return { azw3JumpFromCatalog, azw3PageUp, azw3PageDown }
}

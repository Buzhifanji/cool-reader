import { KookitRender } from "./Kookit";

let rendition: any = null;

export async function renderAzw3(content: Uint8Array) {
  rendition = new KookitRender({ content, renderName: 'Azw3Render' })
  await rendition.action()
}

export function getAzw3Cover() {
  console.log('todo: getEpubCover')
}

export function azw3JumpFromCatalog(href: string) {
  rendition.jump(href);
}
export function azw3PageUp() {
  rendition.prev();
}
export function azw3PageDown() {
  rendition.next();
}

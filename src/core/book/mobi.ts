import { todo } from "src/utils/todo";
import { BookBase } from "./base";
import { KookitRender } from "./Kookit";

class Mobi extends BookBase {
  rendition: any = null

  async render(content: Uint8Array): Promise<any[]> {
    this.rendition = new KookitRender({ content, renderName: 'MobiRender' })
    return await this.rendition.action()
  }

  up() {
    this.isRender()

    return this.rendition!.prev();
  }

  down() {
    this.isRender()

    return this.rendition!.next();
  }

  catalogJump(value: any) {
    this.isRender()

    return this.rendition!.jump(value);
  }

  pageJump(num: number) {
    todo('Mobi page jump')
  }
}

export function getMobiCover() {
  console.log('todo: getEpubCover')
}

export const mobi = new Mobi()
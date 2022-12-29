import { todo } from "src/utils/todo";
import { BookBase } from "./base";
import { KookitRender } from "./Kookit";

class Azw3 extends BookBase {
  rendition: KookitRender | null = null

  async render(content: Uint8Array): Promise<any[]> {
    this.rendition = new KookitRender({ content, renderName: 'Azw3Render' })
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
    todo('Azw3 page jump')
  }
}

export function getAzw3Cover() {
  console.log('todo: getEpubCover')
}

export const azw3 = new Azw3()
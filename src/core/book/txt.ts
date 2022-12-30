import { KookitRender } from "./Kookit";
import chardet from "chardet";
import { BookBase } from "./base";
import { todo } from "src/utils/todo";


class Txt extends BookBase {
  rendition: KookitRender | null = null

  async render(content: Uint8Array): Promise<any[]> {
    const charset = chardet.detect(content) || 'utf8'// 获取文本编码
    this.rendition = new KookitRender({ content, renderName: 'TxtRender', charset })
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
    todo('Txt page jump')
  }
}

export function getTextCover() {
  console.log('todo: getTextCover')
}

export const txt = new Txt();
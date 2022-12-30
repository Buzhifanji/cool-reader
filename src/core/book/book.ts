import { Bookextname } from "src/enums";
import { useReadBookStore } from "./store";
import { todo } from "src/utils/todo";
import { pdf } from "./pdf";
import { epub } from "./epub";
import { mobi } from "./mobi";
import { azw3 } from "./azw3";
import { txt } from "./txt";

export function getBookContext() {
  const { extname } = useReadBookStore().readingBook
  switch (extname) {
    case Bookextname.pdf:
      return pdf;
    case Bookextname.epub:
      return epub
    case Bookextname.mobi:
      return mobi;
    case Bookextname.azw3:
      return azw3;
    case Bookextname.txt:
      return txt;
    default:
      todo(`book context ${extname}`)
      return txt;
  }
}

export async function bookRender(id: string) {
  const store = useReadBookStore();
  await store.init(id)
  const { content } = store.readingBook
  const context = getBookContext();
  const catalog = await context.render(content);
  store.update({ catalog })
}

export function pageUp() {
  const context = getBookContext();
  return context.up()
}

export function pageDown() {
  const context = getBookContext();
  return context.down()
}

export function pageJump(num: number) {
  const context = getBookContext();
  return context.pageJump(num)
}

export function catalogJump(info: any) {
  const context = getBookContext();
  return context.catalogJump(info)
}
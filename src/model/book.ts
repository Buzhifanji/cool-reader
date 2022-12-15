import { Bookextname } from "src/enums";
import { BookData } from "src/interfaces";

export class BookModel implements BookData {
  constructor(
    public bookName: string,
    public extname: Bookextname,
    public size: number,
    public path: string,
    public category: string,
    public cover: string,
    public id: string,
    public chapter: string,
    public content: Uint8Array,
    public catalog: []
  ) { }
}

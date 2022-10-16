import { Bookextname } from "@/enums";
import { BookData } from "@/interfaces";

export class ReadingBook implements BookData {
  constructor(
    public bookName: string,
    public extname: Bookextname,
    public size: number,
    public path: string,
    public category: string,
    public cover: string,
    public id: string,
    public content: Uint8Array,
    public catalog: []
  ) {}
}

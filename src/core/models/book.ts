import { StorageBook } from "../type";
import { Bookextname } from "../utils/enums";

export class ReadingBook implements StorageBook {
  constructor(
    public bookName: string,
    public extname: Bookextname,
    public fileSize: number,
    public path: string,
    public category: string,
    public cover: string,
    public id: string,
    public fileContent: Uint8Array
  ) {}
}

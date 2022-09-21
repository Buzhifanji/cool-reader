import { StorageBook } from "../type";

export class ReadingBook implements StorageBook {
  constructor(
    public bookName: string,
    public extname: string,
    public fileSize: number,
    public path: string,
    public category: string,
    public cover: string,
    public id: string,
    public fileContent: Uint8Array
  ) {}
}

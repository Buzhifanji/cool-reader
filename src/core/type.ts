import { Rendition } from "epubjs";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import { Bookextname } from "./utils/enums";

export interface BufType {
  message: Uint8Array;
}

export interface BaseBook {
  bookName: string; // 书名
  extname: Bookextname; // 书本文件格式类型，例如 pdf、azw3
  fileSize: number; //  书本大小
  path: string; // md5
}

export interface BookInfo extends BaseBook {
  fileContent: Uint8Array;
}

export interface StorageBook extends BaseBook {
  category: string; // 类别，用于书籍分类
  cover: string; // 封面
  id: string; // md5
  fileContent: Uint8Array; // 用于 方便开发功能 ，开发完就删除掉
}

export type ExtnameFn = Record<Bookextname, Function>;

export type BookContext = PDFViewer | Rendition | null;

export type Intervals = [number, number];

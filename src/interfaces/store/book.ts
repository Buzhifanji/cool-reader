import { Bookextname } from "src/enums";
import { Rendition } from "epubjs";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";

export type BookContext = PDFViewer | Rendition | null;

export interface BookData {
  bookName: string; // 书名
  extname: Bookextname; // 书本文件格式类型，例如 pdf、azw3
  size: number; //  书本大小
  path: string; // 书本路径
  category: string; // 类别，用于书籍分类
  cover: string; // 封面
  id: string; // md5
  content: Uint8Array; // 书本内容
  chapter: string; // 正在阅读的章节
  catalog: any[]; // 目录
}

export interface UpdateBook {
  content?: Uint8Array;
  context?: BookContext;
  catalog?: any[]; //
}

export type ExtnameFn = Record<Bookextname, Function>;

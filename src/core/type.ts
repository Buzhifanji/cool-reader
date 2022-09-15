/**
 * 书本扩展名，目前所支持解析的书本类型
 */
export const enum Bookextname {
  pdf = "pdf",
}

export interface BaseBook {
  bookName: string; // 书名
  extname: string; // 书本文件格式类型，例如 pdf、azw3
  size: number; //  书本大小
  id: string; // md5
  lastModified?: number; // 最后修改时间
}

export interface bookType extends BaseBook {
  author: string; // 作者
  category: string; // 类别，用于书籍分类
  cover: string; // 封面
}

export interface BufType {
  message: Uint8Array;
}

export interface _BaseBook {
  bookName: string;
  extname: string;
  fileSize: number;
  path: string;
}

export interface BookInfo extends _BaseBook {
  fileContent: Uint8Array;
}

export interface StorageBook extends _BaseBook {
  category: string; // 类别，用于书籍分类
  cover: string; // 封面
  id: string; // md5
}

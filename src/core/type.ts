/**
 * 书本扩展名，目前所支持解析的书本类型
 */
export const enum Bookextname {
  pdf = "pdf",
}

export interface BaseBookType {
  bookName: string; // 书名
  extname: string; // 书本文件格式类型，例如 pdf、azw3
  author: string; // 作者
  category: string; // 类别，用于书籍分类
  size: number; //  书本大小
  path: string; // 书本地址
  content: any[]; // 内容
  id: string; // md5
}

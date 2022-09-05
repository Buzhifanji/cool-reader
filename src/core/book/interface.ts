export interface BookType {
  name: string; // 书名
  fileType: string; // 书本文件格式类型，例如 pdf、azw3
  author: string; // 作者
  size: number; //  书本大小
  path: string; // 书本地址
  content: any; // 内容
  id: string; //
}

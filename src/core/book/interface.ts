import { Bookextname, BookStatus } from "src/enums";

export type BookScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface BookListItem {
  bookName: string; // 书名
  extname: Bookextname; // 书本文件格式类型，例如 pdf、azw3
  auth: string; // 作者
  publisher: string; // 出版社商
  describe: string; // 描述
  size: number; //  书本大小
  path: string; // 书本路径
  category: string; // 类别，用于书籍分类
  cover: string; // 封面
  id: string; // md5
  createTime: number; // 创建时间
  score: BookScore; // 评分
  content: Uint8Array; // 书本内容
  chapter: string; // 正在阅读的章节
  readProgress: number; // 阅读进度
  lastReadTime: number; // 最新阅读时间
  readAllTime: number;  // 总共已经花费了多少阅读时间
  catalog: any[]; // 目录
  status: BookStatus; // 书籍状态
}
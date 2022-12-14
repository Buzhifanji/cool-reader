/**
 * 书本扩展名，目前所支持解析的书本类型
 */
export enum Bookextname {
  pdf = "pdf",
  epub = "epub",
  mobi = "mobi",
  azw3 = "azw3",
}

export enum NotesType {
  notes,
  highlight,
}

// 阅读工具栏选项
export enum barEnum {
  Copy,
  TextHighlight,
  tilde,
  straightLine,
  edit,
  idea,
}

// 书籍类型
export enum BookType {
  Unread, // 闲置
  Reading, // 正在读
  NotFinishedReading, // 尚未读完
  FinishedReaded, //  已读完
  AbandonReanding, // 弃读
  WantToRead, // 想读
  allBooks, // 我的书架（全部书籍)
}
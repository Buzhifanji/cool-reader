/**
 * 书本扩展名，目前所支持解析的书本类型
 */
export enum Bookextname {
  pdf = "pdf",
  epub = "epub",
  mobi = "mobi",
  azw3 = "azw3",
  txt = "txt",
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

/**
 * 书籍状态
 * 书籍初始状态是闲置，被打开就进入正在读。但是如果书本并未全部读完，而且第一次阅读时间和第二次阅读时间间隔太久，此时需要重复分类了，
 * 间隔7-30天就划分为尚未读完，超过30天进入闲置。
 * 弃读，意味着书籍被删除了，进入了回收站。
 */
export enum BookStatus {
  Unread, // 闲置
  Reading, // 正在读
  NotFinishedReading, // 尚未读完
  FinishedReaded, //  已读完
  AbandonReanding, // 弃读
  WantToRead, // 想读
}
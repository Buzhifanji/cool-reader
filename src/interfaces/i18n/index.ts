export interface LangField {
  // 菜单
  menuBook: string;
  menuNotes: string;
  menuHighlight: string;

  // 书本
  noBookTitle: string;
  noBookDesc: string;
  noBookUpload: string;

  // 目录
  catalog: string;
  catalogShortcutKey: string;
  noCatalog: string;
  noCatalogDescription: string;

  // 笔记
  notes: string;
  notesShortcutKey: string;
  notesTipWrite: string;
  notesPlaceholder: string;

  // 高亮
  highlight: string;

  // 帮助相关
  help: string;
  shortcutKey: string; // 快捷键

  nothing: string;

  add: string;

  // 提示
  addSuccess: string;
  deleteSuccess: string;
  updateSuccess: string;

  // 设置
  setting: string;
  settingLange: string;
}

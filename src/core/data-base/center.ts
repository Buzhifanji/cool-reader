import Dexie, { Table } from 'dexie';
import { DATA_BASE } from 'src/constants';
import { BookListItem } from '../book';
import { BookNotes } from './interface';

const VERSION = 1 // 数据库版本号

const books = '&id,bookName,extname,size,path,category,cover,content,chapter,readProgress,readTime,catalog';
const notes = `&id, bookId, bookName, className, tagName, text, createTime, chapter,
              startDomMeta.tagName, startDomMeta.index, startDomMeta.offset,
              endDomMeta.tagName, endDomMeta.index, endDomMeta.offset,
              notes.content, notes.createTime, notes.tag, notes.id
              `
class DexieStore extends Dexie {
  books!: Table<BookListItem>
  notes!: Table<BookNotes>

  constructor() {
    super(DATA_BASE);
    this.version(VERSION).stores({
      books,
      notes,
    });
  }
}

export const dexieStore = new DexieStore();

export type { DexieStore }

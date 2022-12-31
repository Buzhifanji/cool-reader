import Dexie, { Table } from 'dexie';
import { BOOKLIST } from 'src/constants';
import { BookListItem } from '../book';

class BooksDexie extends Dexie {
  books!: Table<BookListItem>

  constructor() {
    super(BOOKLIST);
    this.version(1).stores({
      books: '&id,bookName,extname,size,path,category,cover,content,chapter,readProgress,readTime,catalog',
    });
  }
}

class BooksDB {
  db: BooksDexie;
  constructor() {
    this.db = new BooksDexie();
  }
  // 添加一条数据
  add(value: BookListItem) {
    return this.db.books.add(value)
  }

  // 删除单条数据
  deleteById(bookId: string) {
    return this.db.books.where({ bookId }).delete();
  }

  // 更新某条数据
  update(value: BookListItem) {
    return this.db.books.put(value)
  }

  // 查询全部数据
  getAll() {
    return this.db.books.toArray();
  }

  // 根据 id 查询数据
  getById(bookId: string) {
    return this.db.books.get(bookId);
  }
}

export const booksDB = new BooksDB();
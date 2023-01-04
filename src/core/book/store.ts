import { defineStore } from 'pinia'
import { isIndex } from 'src/utils';
import { Bookextname } from "src/enums";
import { BookListItem } from './interface';
import { addBooks, getAllBooks, getBookById, removeBookById, updateBook } from '../data-base';

export const useDownloadFieStore = defineStore('downloadFieStore', () => {
  const isDownloading = ref<boolean>(false); // 因为一次只能读取一个文件，所以设定此变量，防止用户在读取中重复读取文件
  const downloadProgress = ref<number>(0); // 下载进度

  function setDownloadState(value: boolean) {
    isDownloading.value = value;
  }

  function setDownloadProgress(value: number) {
    downloadProgress.value = value;
  }

  return {
    isDownloading,
    downloadProgress,
    setDownloadState,
    setDownloadProgress,
  }
})

export const useBookListStore = defineStore('bookListStore', () => {
  const bookList = ref<BookListItem[]>([])

  async function init() {
    const books = await getAllBooks();
    bookList.value = books
  }

  async function add(book: BookListItem) {
    bookList.value.unshift(book)
    return await addBooks(book) // 存储到 indexDB
  }

  async function remove(bookId: string) {
    const index = bookList.value.findIndex((book) => book.id === bookId);
    if (isIndex(index)) {
      const name = bookList.value[index].bookName;
      bookList.value.splice(index, 1);
      await removeBookById(bookId) // 移除 indexDB 的数据
      return { result: true, name }
    } else {
      return { result: false, name: '' }
    }
  }

  return {
    bookList,
    add,
    remove,
    init,
  }
})


export const useReadBookStore = defineStore('readBookStore', () => {
  // 正在阅读的书籍
  const readingBook = ref<BookListItem>({
    bookName: '',
    extname: Bookextname.pdf,
    size: 0,
    path: '',
    category: '',
    cover: '',
    id: '',
    chapter: '',
    content: new Uint8Array(),
    readProgress: 0,
    readTime: 0,
    catalog: []
  })

  async function init(bookId: string) {
    const book = await getBookById(bookId);
    if (book) {
      console.log({ book })
      readingBook.value = book;
    }
  }

  function update({ content, catalog, chapter, readProgress, readTime }: Partial<BookListItem>) {
    if (content) {
      readingBook.value.content = content;
    }

    if (catalog) {
      readingBook.value.catalog = catalog
    }

    if (chapter) {
      readingBook.value.chapter = chapter
    }

    if (readProgress && readingBook.value.readProgress !== readProgress) {
      readingBook.value.readProgress = readProgress
      updateBook(toRaw(readingBook.value))
    }

    if (readTime) {
      readingBook.value.readTime = readTime
    }
  }

  return {
    readingBook,
    init,
    update
  }
})
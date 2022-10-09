import { updateBook } from "../../components/book-list/book-list";
import { notification } from "../../naive";
import { getEpubCover } from "../file/epub";
import { getPDFCover } from "../file/pdf";
import { addForageFile, getForageFiles, hasForageFile } from "../store/file";
import { BookInfo, ExtnameFn, StorageBook } from "../type";
import { Bookextname } from "../utils/enums";
import { isIndex } from "../utils/is";
import { setBookId } from "./md5";

export async function addBook(bookInfo: BookInfo) {
  const { bookName } = bookInfo;
  const bookId = await setBookId(bookInfo);
  const value = await hasForageFile(bookId);
  if (value) {
    notification.warning({
      content: "书籍已存在！",
      meta: bookName,
      duration: 2000,
      keepAliveOnHover: true,
    });
  } else {
    const cover = await generateBookCover(bookInfo);
    const cacheBook: StorageBook = {
      ...bookInfo,
      id: bookId,
      cover: cover ? cover : "",
      category: "",
    };
    // 离线缓存
    addForageFile(cacheBook);
    // 在线缓存
    updateBook(cacheBook);

    notification.success({
      content: "添加成功！",
      meta: bookName,
      duration: 2000,
      keepAliveOnHover: true,
    });
  }
}

/**
 * 通过书本 id，来确认多窗口数据共享是具体内容，但 由于浏览器会对 URI 编码处理，为了确保获取数据正确，所有需要对 id 进行编码处理。
 * @param id 书本id
 * @param isURI 判断是否需要 编码处理
 * @returns
 */
export async function findBook(
  id: string,
  isURI = true
): Promise<StorageBook | null> {
  const list = await getForageFiles();
  const books = list ? [...list] : [];
  const getId = (id: string) =>
    isURI ? decodeURIComponent(encodeURIComponent(id)) : id;
  const index = books.findIndex((book) => getId(book.id) === id);
  return isIndex(index) ? books[index] : null;
}

function generateBookCover({
  fileContent,
  extname,
}: BookInfo): Promise<string> {
  const BooCoverkStatus: ExtnameFn = {
    [Bookextname.pdf]: getPDFCover,
    [Bookextname.epub]: getEpubCover,
  };
  return BooCoverkStatus[extname]?.(fileContent);
}

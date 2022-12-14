import { Bookextname } from "src/enums";
import { BookData, ExtnameFn } from "src/interfaces";
import { notification } from "src/naive";
import { addBook, hasBook } from "src/store";
import { updateBook } from "src/views/books/book";
import { getAzw3Cover } from "./azw3";
import { getEpubCover } from "./epub";
import { setBookId } from "./md5";
import { getMobiCover } from "./mobi";
import { getPDFCover } from "./pdf";

export async function cacheBook(book: BookData) {
  const { bookName } = book;
  const bookId = await setBookId(book);
  const value = await hasBook(bookId);
  if (value) {
    notification.warning({
      content: "书籍已存在！",
      meta: bookName,
      duration: 2000,
      keepAliveOnHover: true,
    });
  } else {
    const cover = await generateBookCover(book);
    book.cover = cover;
    book.id = bookId;

    // 离线缓存
    addBook(book);
    // 在线缓存
    updateBook(book);

    notification.success({
      content: "添加成功！",
      meta: bookName,
      duration: 2000,
      keepAliveOnHover: true,
    });
  }
}

function generateBookCover({ content, extname }: BookData): Promise<string> {
  const BooCoverkStatus: ExtnameFn = {
    [Bookextname.pdf]: getPDFCover,
    [Bookextname.epub]: getEpubCover,
    [Bookextname.mobi]: getMobiCover,
    [Bookextname.azw3]: getAzw3Cover,
  };
  return BooCoverkStatus[extname]?.(content);
}

import { getHighlights } from "src/components/highlight/highlight";
import { Bookextname } from "src/enums";
import { ExtnameFn } from "src/interfaces";
import { getReadingBook, setReadingBook } from "src/store";
import { renderEpub, useEpubChangePage } from "src/core/file/epub";
import { renderPdf, usePdfChangePage } from "src/core/file/pdf";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { getIdeas } from "src/components/idea/idea";
import { renderMobi, useMobiChangePage } from "src/core/file/mobi";
import { useAzw3ChangePage, renderAzw3 } from "src/core/file/azw3";
import { renderText, useTextChangePage } from "src/core/file/txt";
import { bookRender } from "src/core/book";

export const useReaderBook = (route: RouteLocationNormalizedLoaded) => {
  const readingBook = getReadingBook();
  async function init() {
    try {
      const id = route.query.id as string;
      await bookRender(id)
      // 获取笔记内容
      getIdeas();
      // 获取高亮内容
      getHighlights();
      // const book = await setReadingBook(route.query.id as string, null);
      // const renderBookStatus: ExtnameFn = {
      //   [Bookextname.pdf]: renderPdf,
      //   [Bookextname.epub]: renderEpub,
      //   [Bookextname.mobi]: renderMobi,
      //   [Bookextname.azw3]: renderAzw3,
      //   [Bookextname.txt]: renderText,
      // };
      // if (book.content) {
      //   // useTitle(book.bookName + '- Cool do Reader')

      //   await renderBookStatus[book.extname]?.(book.content);
      //   // 获取笔记内容
      //   getIdeas();
      //   // 获取高亮内容
      //   getHighlights();
      // }
    } catch (error) {
      console.error(error);
    }
  }
  init();
  return { readingBook };
};

// 翻页
export const usePageTurn = () => {
  const readingBook = getReadingBook();
  const { pdfPageUp, pdfPageDown } = usePdfChangePage();
  const { epubPageUp, epubPageDown } = useEpubChangePage();
  const { mobiPageUp, mobiPageDown } = useMobiChangePage();
  const { azw3PageUp, azw3PageDown } = useAzw3ChangePage()
  const { textPageUp, textPageDown } = useTextChangePage()

  function pageUp() {
    const pageUpStates: ExtnameFn = {
      [Bookextname.pdf]: pdfPageUp,
      [Bookextname.epub]: epubPageUp,
      [Bookextname.mobi]: mobiPageUp,
      [Bookextname.azw3]: azw3PageUp,
      [Bookextname.txt]: textPageUp,
    };
    pageUpStates[readingBook.extname]?.();
  }

  function pageDown() {
    const pageDownStates: ExtnameFn = {
      [Bookextname.pdf]: pdfPageDown,
      [Bookextname.epub]: epubPageDown,
      [Bookextname.mobi]: mobiPageDown,
      [Bookextname.azw3]: azw3PageDown,
      [Bookextname.txt]: textPageDown,
    };
    pageDownStates[readingBook.extname]?.();
  }

  return { pageUp, pageDown };
};

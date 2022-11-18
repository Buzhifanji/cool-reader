import { Bookextname } from "src/enums";
import { BookData } from "src/interfaces";
import { getDocument } from "pdfjs-dist";
import SparkMD5 from "spark-md5";

/**
 * 生成书本的唯一id
 */
export function setBookId(book: BookData) {
  return new Promise<string>((resolve, reject) => {
    try {
      const { extname, content } = book;
      if (extname === Bookextname.pdf) {
        setPdfMD5(book).then((value) => resolve(value));
      } else {
        const hash = SparkMD5.ArrayBuffer.hash(content);
        resolve(hash);
      }
    } catch (error) {
      reject("set book id is error: " + error);
    }
  });
}

function setPdfMD5({ bookName, size, content }: BookData): Promise<string> {
  return new Promise((resolve) => {
    getDocument(content)
      .promise.then((pdfDoc: any) => {
        resolve(pdfDoc.fingerprints());
      })
      .catch((err: any) => {
        resolve(bookName + "-" + size);
      });
  });
}

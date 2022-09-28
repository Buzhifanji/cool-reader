import { getDocument } from "pdfjs-dist";
import SparkMD5 from "spark-md5";
import { BookInfo } from "../type";
import { Bookextname } from "../utils/enums";

/**
 * 生成书本的唯一id
 */
export function setBookId(book: BookInfo) {
  return new Promise<string>((resolve, reject) => {
    try {
      const { extname, fileContent } = book;
      if (extname === Bookextname.pdf) {
        setPdfMD5(book).then((value) => resolve(value));
      } else {
        const hash = SparkMD5.ArrayBuffer.hash(fileContent);
        resolve(hash);
      }
    } catch (error) {
      reject("set book id is error: " + error);
    }
  });
}

function setPdfMD5({
  bookName,
  fileSize,
  fileContent,
}: BookInfo): Promise<string> {
  return new Promise((resolve) => {
    getDocument(fileContent)
      .promise.then((pdfDoc: any) => {
        resolve(pdfDoc.fingerprints());
      })
      .catch((err: any) => {
        resolve(bookName + "-" + fileSize);
      });
  });
}

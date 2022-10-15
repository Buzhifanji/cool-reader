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
        setPdfMD5(book).then((value) => resolve(formatId(value)));
      } else {
        const hash = SparkMD5.ArrayBuffer.hash(fileContent);
        resolve(formatId(hash));
      }
    } catch (error) {
      reject("set book id is error: " + error);
    }
  });
}

// 通过书本 id，来确认多窗口数据共享是具体内容，但 由于浏览器会对 URI 编码处理，为了确保获取数据正确，所有需要对 id 进行编码处理。
function formatId(id: string): string {
  return decodeURIComponent(encodeURIComponent(id));
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

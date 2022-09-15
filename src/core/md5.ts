import { Bookextname, BookInfo } from "./type";
import { pdfLoadingTask } from "./utils";

/**
 * 生成书本的唯一id
 */
export function setBookId({
  bookName,
  extname,
  fileSize,
  fileContent,
}: BookInfo) {
  return new Promise<string>((resolve, reject) => {
    try {
      if (extname === Bookextname.pdf) {
        pdfLoadingTask(fileContent)
          .promise.then((pdfDoc: any) => {
            resolve(pdfDoc.fingerprints());
          })
          .catch((err: any) => {
            resolve(bookName + "-" + fileSize);
          });
      } else {
        // TODO:
      }
    } catch (error) {
      reject("set book id is error: " + error);
    }
  });
}

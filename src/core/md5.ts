import { Bookextname } from "./type";
import { pdfLoadingTask } from "./utils";

/**
 * 生成书本的唯一id
 */
export function setBookId(
  file: File,
  extname: string,
  fileContent: Uint8Array
) {
  return new Promise<string>((resolve, reject) => {
    try {
      if (extname === Bookextname.pdf) {
        pdfLoadingTask(fileContent)
          .promise.then((pdfDoc: any) => {
            resolve(pdfDoc.fingerprints());
          })
          .catch((err: any) => {
            resolve(file.name + "-" + file.size);
          });
      } else {
        // TODO:
      }
    } catch (error) {
      reject("set book id is error: " + error);
    }
  });
}

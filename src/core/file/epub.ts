import epubjs from "epubjs";

export function getEpubCover(fileContent: Uint8Array): Promise<string> {
  return new Promise((resolve, reject) => {
    const book = epubjs(fileContent.buffer);
    book
      .coverUrl()
      .then((value) => {
        value ? resolve(value) : resolve("");
      })
      .catch((err) => {
        resolve("");
      });
  });
}

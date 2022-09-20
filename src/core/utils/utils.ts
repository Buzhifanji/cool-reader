export const pdfLoadingTask = (fileContent: Uint8Array | string): any => {
  const pdfjsLib = (window as Window)["pdfjs-dist/build/pdf"];
  const param =
    typeof pdfjsLib === "string" ? fileContent : { data: fileContent };
  return pdfjsLib.getDocument(param);
};

/**
 * 合并两个 Uint8Array，合并之后的顺序结果是： [...buf1, ...buf2]
 * @param buf1
 * @param buf2
 * @returns
 */
export function mergerUint8Array(
  buf1: Uint8Array,
  buf2: Uint8Array
): Uint8Array {
  const n = buf1.length + buf2.length;
  let result = new Uint8Array(n);
  result.set(buf1);
  result.set(buf2, buf1.length);
  return result;
}

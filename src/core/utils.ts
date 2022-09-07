export const pdfLoadingTask = (fileContent: Uint8Array): any => {
  const pdfjsLib = (window as Window)["pdfjs-dist/build/pdf"];
  return pdfjsLib.getDocument({ data: fileContent });
};

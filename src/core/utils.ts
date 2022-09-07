export const pdfLoadingTask = (fileContent: Uint8Array): Promise<any> => {
  const pdfjsLib = (window as Window)["pdfjs-dist/build/pdf"];
  return pdfjsLib.getDocument({ data: fileContent });
};

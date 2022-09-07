import { pdfLoadingTask } from "./utils";

export function loadPdf(fileContent: Uint8Array) {
  const pdfjsLib = (window as Window)["pdfjs-dist/build/pdf"];
  const loadingTask = pdfjsLib.getDocument({ data: fileContent });
  loadingTask.promise
    .then((pdf: any) => {
      return pdf.getPage(1);
    })
    .then((page: any) => {
      const scale = 1.5; // 设置展示比例
      const viewport = page.getViewport({
        scale,
      }); // 获取pdf尺寸
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      canvas.height =
        viewport.height || viewport.viewBox[3]; /* viewport.height is NaN */
      canvas.width =
        viewport.width || viewport.viewBox[2]; /* viewport.width is also NaN */

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    })
    .catch((error: any) => {
      console.log("error", error);
    });
}

export function getPDFCover(fileContent: Uint8Array): Promise<string> {
  return new Promise<string>((resolve) => {
    pdfLoadingTask(fileContent)
      .promise.then((pdfDoc: any) => {
        return pdfDoc.getPage(1);
      })
      .then((page: any) => {
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height || viewport.viewBox[3];
        canvas.width = viewport.width || viewport.viewBox[2];
        const taks = page.render({ canvasContext: context, viewport });
        taks.promise.then(async () => {
          const cover = canvas.toDataURL("image/jpeg");
          resolve(cover);
        });
      })
      .catch((err: any) => {
        resolve("");
      });
  });
}

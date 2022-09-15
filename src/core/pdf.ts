import { ref } from "vue";
import { pdfLoadingTask } from "./utils";

const scale = ref<number>(1); // 展示比例

function renderPageContent(page: any, canvas: HTMLCanvasElement) {
  const viewport = page.getViewport({
    scale: scale.value, // 展示比例
    rotation: 0, // 旋转角度
  });
  const width = viewport.width;
  const height = viewport.height;
  const viewBox = viewport.viewBox;

  const context = canvas.getContext("2d");
  canvas.height = height || viewBox[3];
  canvas.width = width || viewBox[2];

  // 渲染内容
  return page.render({ canvasContext: context, viewport });
}

export function loadPdf(fileContent: Uint8Array) {
  pdfLoadingTask(fileContent)
    .promise.then((pdf: any) => {
      return pdf.getPage(1);
    })
    .then((page: any) => {
      const canvas = document.getElementById(
        "view-canvas"
      ) as HTMLCanvasElement;
      renderPageContent(page, canvas);
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
        const canvas = document.createElement("canvas");
        const taks = renderPageContent(page, canvas);
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

import { PDFDocumentProxy } from "pdfjs-dist";

interface CatalogOptions {
  extname: "pdf"; // 书本文件格式类型
  documentProxy: PDFDocumentProxy;
}

export const catalogs = new Map<string, any[]>();

export async function setCatalog(id: string, options: CatalogOptions) {
  let result: any[] = [];
  switch (options.extname) {
    case "pdf":
      result = await options.documentProxy.getOutline();
      if (result.length === 1 && result[0].title === "目录") {
        result = [];
      }
      break;
  }

  if (Array.isArray(result)) {
    catalogs.set(id, result);
  } else {
    catalogs.set(id, []);
  }
}

export function getCatalog(id: string): any[] {
  return catalogs.get(id) || [];
}

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
      result = formatePdfCatalog(result);
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

function formatePdfCatalog(list: any[]) {
  // 处理 没有目录的特殊情况
  if (list.length === 1 && list[0].title === "目录") {
    return [];
  }

  // 处理没有 子数据的时候 不显示图标的情况
  const handle = (arr: any[]) => {
    arr.forEach((item) => {
      const items = item.items;
      if (items && items.length) {
        handle(items);
      } else {
        delete item.items;
      }
    });
  };
  handle(list);
  return list;
}

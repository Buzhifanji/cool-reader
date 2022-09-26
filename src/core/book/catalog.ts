import { PDFDocumentProxy } from "pdfjs-dist";
import { toRaw } from "vue";
import { Bextname } from "../file/extname";
import { getPdfDocument } from "../store";
import { arrayHasData, isArray, isObj, isOwn } from "../utils/utils";

interface CatalogOptions {
  extname: Bextname.pdf; // 书本文件格式类型
  documentProxy: PDFDocumentProxy;
}

export const catalogs = new Map<string, any[]>();

export async function setCatalog(
  id: string,
  { extname, documentProxy }: CatalogOptions
) {
  let result: any[] = [];
  switch (extname) {
    case Bextname.pdf:
      result = await documentProxy.getOutline();
      result = formatePdfCatalog(result);
      break;
  }

  // 处理获取目录异常
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

export function generateGotoPage({
  id,
  extname,
  desc,
}: {
  id: string;
  extname: string;
  desc: any;
}) {
  switch (extname) {
    case Bextname.pdf:
      pdfGotoPage(id, desc);
      break;
  }
}

async function pdfGotoPage(id: string, desc: any) {
  return new Promise<any>(async (resolve, reject) => {
    const pdfContext = getPdfDocument(id)!;
    if (pdfContext && isArray(desc) && arrayHasData(desc)) {
      const { pdf } = pdfContext;
      const refProxy = toRaw(desc[0]);
      if (isObj(refProxy) && isOwn(refProxy, "num") && isOwn(refProxy, "gen")) {
        const pageIndex = await pdf.getPageIndex(refProxy);
        console.log("pageIndex: " + pageIndex);
        // renderPages(pageIndex, pdf);
        resolve("ok");
      } else {
        console.log("refProxy", refProxy);
      }
    }
  }).catch((err) => {
    console.log("error", err);
    Promise.reject(err);
  });
}

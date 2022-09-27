import { ref, toRaw } from "vue";
import { Bextname } from "../../core/file/extname";
import { getPdfBook, getPdfCatalogs } from "../../core/store/pdf";
import { StorageBook } from "../../core/type";
import { arrayHasData, isArray, isObj, isOwn } from "../../core/utils/utils";

export const useCatalog = ({ extname, id }: StorageBook) => {
  const catalog = ref<any[]>([]);

  function switchBookCatalog() {
    switch (extname) {
      case Bextname.pdf:
        catalog.value = getPdfCatalogs(id);
        break;
    }
  }

  switchBookCatalog();

  return { catalog };
};

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

async function pdfGotoPage(bookId: string, desc: any) {
  return new Promise<any>(async (resolve, reject) => {
    if (isArray(desc) && arrayHasData(desc)) {
      const refProxy = toRaw(desc[0]);
      if (isObj(refProxy) && isOwn(refProxy, "num") && isOwn(refProxy, "gen")) {
        const { pdf, pdfViewer } = getPdfBook(bookId)!;
        const pageIndex = await pdf!.getPageIndex(refProxy);
        pdfViewer!.scrollPageIntoView({
          pageNumber: pageIndex,
        });
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
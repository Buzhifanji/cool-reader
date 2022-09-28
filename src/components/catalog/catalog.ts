import { reactive, ref, toRaw } from "vue";
import { getEpubCatalog } from "../../core/file/epub";
import { getPdfBook, getPdfCatalogs } from "../../core/store/pdf";
import { StorageBook } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";
import { arrayHasData, isArray, isObj, isOwn } from "../../core/utils/utils";

export const useCatalog = ({ extname, id }: StorageBook) => {
  const catalog = ref<any[]>([]);
  const menuFieds = reactive({
    key: "key",
    label: "label",
    children: "children",
  });

  function setField(key: string, label: string, children: string) {
    menuFieds.key = key;
    menuFieds.label = label;
    menuFieds.children = children;
  }
  function switchBookCatalog() {
    switch (extname) {
      case Bookextname.pdf:
        setField("title", "title", "items");
        catalog.value = getPdfCatalogs(id);
        break;
      case Bookextname.epub:
        setField("id", "label", "subitems");
        catalog.value = getEpubCatalog(id);
        break;
    }
  }

  switchBookCatalog();

  return { catalog, menuFieds };
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
    case Bookextname.pdf:
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

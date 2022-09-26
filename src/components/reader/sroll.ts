import { ref } from "vue";
import { renderPages } from "../../core/file/pdf";
import { getPdfDocument } from "../../core/store";

export function useVirtualList(bookId: string) {
  // 滚动条
  const srollRef = ref<null | HTMLElement>(null);

  function getPageIndex(heights: Map<number, number>) {
    const { scrollTop } = srollRef.value!;
    if (scrollTop <= 0) {
      return 1;
    }

    if (heights.size === 0) {
      return 1;
    }

    if (scrollTop <= heights.get(1)!) {
      return 1;
    }
    let result = 1;
    let count = 0;
    for (let i = 1; i <= heights.size; i++) {
      count += heights.get(i)! + 18 + 10;
      if (count > scrollTop) {
        result = i;
        break;
      }
    }
    return result;
  }
  function calculateRange() {
    if (srollRef.value) {
      const { pdf, heights } = getPdfDocument(bookId)!;
      const index = getPageIndex(heights);
      renderPages(index, pdf);
    }
  }

  let rAF: null | number = null;
  function srcollEvent() {
    if (rAF) {
      return;
    }
    rAF = window.requestAnimationFrame(() => {
      rAF = null;
      calculateRange();
    });
  }

  return { srollRef, srcollEvent };
}

import { Ref } from "vue";

type PageNumber = string | number;

const pageNumber = ref<PageNumber>(1);

export function updatePageNumber(number: PageNumber) {
  pageNumber.value = number;
}

export function getPageNumber(): Ref<PageNumber> {
  return pageNumber;
}

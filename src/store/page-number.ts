import { Ref } from "vue";

const pageNumber = ref<number>(1);

export function updatePageNumber(number: number) {
  pageNumber.value = number;
}

export function getPageNumber(): Ref<number> {
  return pageNumber;
}

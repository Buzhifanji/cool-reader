import { Ref } from "vue";

const pageNumber = ref<number>(1);

export function updatePageNumber(number: number) {
  pageNumber.value = number;
  console.log(pageNumber.value)
}

export function getPageNumber(): Ref<number> {
  return pageNumber;
}

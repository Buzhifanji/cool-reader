import { DomSource } from "src/interfaces";

export function sortNotes(arr: DomSource[]) {
  return [...arr].sort((a, b) => {
    if (a.pageNumber > b.pageNumber) {
      return 1;
    } else if (a.pageNumber < b.pageNumber) {
      return -1;
    } else {
      if (a.startMeta.parentIndex > b.startMeta.parentIndex) {
        return 1;
      } else if (a.startMeta.parentIndex < b.startMeta.parentIndex) {
        return -1;
      } else {
        return 0;
      }
    }
  });
}

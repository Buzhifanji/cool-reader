import { DomSource } from "src/core/web-highlight";

export function sortNotes(arr: DomSource[]) {
  console.log('todo: sortNotes')
  return arr
  // return [...arr].sort((a, b) => {
  //   if (a.pageNumber > b.pageNumber) {
  //     return 1;
  //   } else if (a.pageNumber < b.pageNumber) {
  //     return -1;
  //   } else {
  //     if (a.startDomMeta.index > b.startDomMeta.index) {
  //       return 1;
  //     } else if (a.startDomMeta.index < b.startDomMeta.index) {
  //       return -1;
  //     } else {
  //       return 0;
  //     }
  //   }
  // });
}

let bookId: string | null = null;

export function setOpenedBookId(id: string) {
  bookId = id;
}

export function getOpenedBookId() {
  return bookId;
}

const catalogs = new Map<string, any[]>();

export function setCatalog(bookId: string, value: any[]) {
  catalogs.set(bookId, value);
}

export function getCatalog(bookId: string): any[] {
  return catalogs.get(bookId) || [];
}

export function formateCatalog(arr: any[], key: string) {
  arr.forEach((item) => {
    const items = item[key];
    if (items && items.length) {
      formateCatalog(items, key);
    } else {
      delete item[key];
    }
  });
}

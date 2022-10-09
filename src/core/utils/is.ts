export const isArray = (value: any) => Array.isArray(value);
export const arrayHasData = (value: any[]) => arrayHasData.length > 0;
export const isObj = (value: any) =>
  Object.prototype.toString.call(value) === "[object Object]";
export const isOwn = (obj: Object, key: string) => obj.hasOwnProperty(key);
export const isIndex = (index: number) => index !== -1;
export const isTextNode = (node: Text): boolean =>
  node.nodeType === Node.TEXT_NODE;

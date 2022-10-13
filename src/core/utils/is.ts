export const isArray = (value: any) => Array.isArray(value);
export const arrayHasData = (value: any[]) => arrayHasData.length > 0;
export const isObj = (value: any) =>
  Object.prototype.toString.call(value) === "[object Object]";
export const isOwn = (obj: Object, key: string) => obj.hasOwnProperty(key);
export const isIndex = (index: number) => index !== -1;
export const isTextNode = (node: Text): boolean =>
  node.nodeType === Node.TEXT_NODE;

export const isObjEqual = <T extends object>(x: T, y: T) => {
  if (x === y) {
    return true;
  } else if (isObj(x) && isObj(y)) {
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }
    for (let key in x) {
      if (y.hasOwnProperty(key)) {
        if (!isObjEqual(x[key] as object, y[key] as object)) return false;
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};

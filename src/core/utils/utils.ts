/**
 * 合并两个 Uint8Array，合并之后的顺序结果是： [...buf1, ...buf2]
 * @param buf1
 * @param buf2
 * @returns
 */
export function mergerUint8Array(
  buf1: Uint8Array,
  buf2: Uint8Array
): Uint8Array {
  const n = buf1.length + buf2.length;
  let result = new Uint8Array(n);
  result.set(buf1);
  result.set(buf2, buf1.length);
  return result;
}

export const isArray = (value: any) => Array.isArray(value);
export const arrayHasData = (value: any[]) => arrayHasData.length > 0;
export const isObj = (value: any) =>
  Object.prototype.toString.call(value) === "[object Object]";
export const isOwn = (obj: Object, key: string) => obj.hasOwnProperty(key);
export const isIndex = (index: number) => index !== -1;

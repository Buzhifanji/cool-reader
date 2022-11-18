import { Intervals } from "src/interfaces";
import SparkMD5 from "spark-md5";

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

/**
 * 合并区间
 * @param list Intervals
 * @param newList Intervals
 * @returns
 */
export function mergeIntervals(
  list: Intervals[],
  newList: Intervals
): Intervals[] {
  const intervals = [...list, newList].sort((a, b) => a[0] - b[0]); // 排序从小到大;

  if (intervals.length < 2) {
    return intervals;
  }

  let current = intervals[0];

  const result: Intervals[] = [];

  for (let interval of intervals) {
    if (current[1] >= interval[0]) {
      // 重叠 更新 右边界
      current[1] = Math.max(current[1], interval[1]);
    } else {
      result.push(current);
      current = interval;
    }
  }

  result.push(current);

  return result;
}

export function stringTohash(text: string): string {
  // 由于 querySelector是按css规范来实现的，所以它传入的字符串中第一个字符不能是数字、特殊字符，
  return "a" + SparkMD5.hash(text);
}

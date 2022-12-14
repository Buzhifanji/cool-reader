import { isObj } from "./is";

// 驼峰转下划线
export const camelCaseToUnderline = (name: string) =>
  name.replace(/\B([A-Z])/g, "_$1").toLowerCase();

// 下划线转换驼峰
export const underlineToCamelCase = (name: string) => {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};


// 驼峰转下横线
export const camelCaseToHorizontalLine = (name: string) =>
  name.replace(/\B([A-Z])/g, "-$1").toLowerCase();

/**
 * 格式化 js 与 rsut 交互的数据
 * @param param 需要格式化的数据
 * @param isToUnderLine true => 驼峰转下划线; false => 下划线转换驼峰
 * @returns
 */
export function generateServiceParams<T extends object, V extends object>(
  param: T,
  isToUnderLine: boolean = true
): V {
  const result: any = {};
  Object.entries(param).forEach(([key, value]) => {
    const newKey = isToUnderLine
      ? camelCaseToUnderline(key)
      : underlineToCamelCase(key);
    if (isObj(value)) {
      result[newKey] = generateServiceParams(value as object, isToUnderLine);
    } else {
      result[newKey] = value;
    }
  });
  return result;
}

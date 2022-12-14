// 自定义样式

import { customReaderCss } from "src/interfaces";
import { camelCaseToHorizontalLine, getIframeDoc } from "src/utils";

const readerStyleConfig = shallowReactive<customReaderCss>({
  fontSize: '17px', // 字体大小
  fontFamily: 'Inter, Avenir, Helvetica, Arial, sans-serif', // 字体
  color: "#353c46", // 字体颜色
  backgroundColor: '#fff', // 背景色
  marginTop: '15px', // 
  lineHeight: '28px', // 行高
})

export function getCustomCss() {
  let result = '';
  Object.entries(readerStyleConfig).forEach(([key, value]) => {
    result += `${camelCaseToHorizontalLine(key)}: ${value};`
  })

  return result
}

watch(readerStyleConfig, () => {
  const doc = getIframeDoc();
  if (doc) {
    const css = getCustomCss();
    doc.body.setAttribute("style", css)
  }
})


// setTimeout(() => {
//   readerStyleConfig.color = 'red';
//   readerStyleConfig.fontSize = '20px'
// }, 1000)
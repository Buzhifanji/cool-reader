import { DomSource } from "src/core/web-highlight";
import { NotesSource } from "src/interfaces";

export const createTime = () => new Date().valueOf();

export const hanldeNotesByTime = (list: DomSource[]) => {
  // 按时间分类整理
  const map = new Map<string, DomSource[]>();
  list.forEach(item => {
    const time = useDateFormat(item.createTime, 'YYYY-MM-DD').value
    const content = map.get(time)
    if (content) {
      content.push(item)
    } else {
      map.set(time, [item])
    }
  })

  // 按时时间排序
  const sortList: { time: string, content: DomSource[] }[] = []
  map.forEach((value, key) => {
    sortList.push({ time: key, content: value })
  })
  sortList.sort((a, b) => a.time < b.time ? 1 : -1)

  // 转换成数组（方便实现虚拟列表功能）
  const result: NotesSource[] = []
  sortList.forEach(({ time, content }) => {
    result.push({ time, id: time })
    content.forEach(value => {
      result.push({ ...value, id: value.createTime.toString() })
    })
  })
  return result
}
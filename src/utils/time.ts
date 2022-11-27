import { DomSource } from "src/core/web-highlight";
import { NotesSource } from "src/interfaces/components/notes";

export const createTime = () => new Date().valueOf();

export const hanldeList = (list: DomSource[]) => {
  const map = new Map<number, DomSource[]>();
  list.forEach(item => {
    const time = item.createTime
    const content = map.get(time)
    if (content) {
      content.push(item)
    } else {
      map.set(time, [item])
    }
  })

  const result: NotesSource[] = []
  map.forEach((value, key) => {
    result.push({ time: key, content: value })
  })

  return result.sort((a, b) => a.time < b.time ? -1 : 1)
}
import { config } from "src/config"
import { OPEN_NOTES } from "src/constants"
import { RouterName } from "src/enums"
import { BookData } from "src/interfaces"
import { Router } from "vue-router"
import { BookNotes } from "../data-base"
import { createWin, setReaderWinUlr } from "../windows"

export const openBookReader = (value: BookNotes | BookData, router: Router) => {
  let id;
  if (Reflect.has(value, 'notes')) {
    // 从笔记 打开阅读器
    id = (value as BookNotes).bookId

    localStorage.setItem(OPEN_NOTES, JSON.stringify(toRaw(value)))
  } else {
    // 从书本列表打开阅读器
    id = (value as BookData).id
    localStorage.removeItem(OPEN_NOTES)
  }

  if (config.multiWindow) {
    const url = setReaderWinUlr(id)
    createWin(id, { url, title: value.bookName })
  } else {
    router.push({ name: RouterName.reader, query: { id } })
  }
}
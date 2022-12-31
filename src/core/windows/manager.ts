import { WebviewWindow, WindowOptions } from "@tauri-apps/api/window";
import { NOTES_CHANGE, READ_PROGRESS_CHANGE } from "src/constants";
import { message } from "src/naive";
import { useAllNotesStore } from "src/store";
import { useBookListStore } from "../book";

export const windowConfig: WindowOptions = {
  title: '',              // 窗口标题
  url: '',                // 路由地址url
  width: 1000,             // 窗口宽度
  height: 700,            // 窗口高度
  minWidth: 900,         // 窗口最小宽度
  minHeight: 600,        // 窗口最小高度
  x: 0,                // 窗口相对于屏幕左侧坐标
  y: 0,                // 窗口相对于屏幕顶端坐标
  center: true,           // 窗口居中显示
  resizable: true,        // 是否支持缩放
  maximized: false,       // 最大化窗口
  decorations: false,     // 窗口是否无边框及导航条
  alwaysOnTop: false,     // 置顶窗口
}

export function setReaderWinUlr(id: string) {
  // 处理：runtime error: Window labels must only include alphanumeric characters, `-`, `/`, `:` and `_`."
  return `/reader?id=${encodeURIComponent(id)}`
}


export async function createWin(label: string, options: WindowOptions) {
  const args = Object.assign(windowConfig, options);

  // 判断窗口是否存在
  const existWin = WebviewWindow.getByLabel(label)
  if (existWin) {
    await existWin.close()
  }

  const win = new WebviewWindow(label, args)


  // 创建成功
  win.once("tauri://created", function (value) {
  });

  // 创建失败
  win.once("tauri://error", function (e) {
    message.error(e.payload as string, { duration: 3000, closable: true })
  });

  // 窗口通信: 监听笔记变化
  win.listen(NOTES_CHANGE, () => {
    const notesStore = useAllNotesStore();
    notesStore.updateAllNotes();
  })

  // 监听阅读进度变更
  win.listen(READ_PROGRESS_CHANGE, () => {
    const bookListStore = useBookListStore();
    bookListStore.init();
  })
}

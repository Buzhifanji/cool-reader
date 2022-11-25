import { createEle } from "./dom"

function imageToBase64(img: HTMLImageElement) {
  const canvas = createEle('canvas')
  const { width, height } = img
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')!
  context.drawImage(img, 0, 0, width, height)
  const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  return canvas.toDataURL("image/" + ext)
}

export function urlToBase64(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      const res = imageToBase64(img)
      resolve(res)
    }
  })
}

export function formateCatalog(arr: any[], key: string) {
  arr.forEach((item) => {
    const items = item[key];
    if (items && items.length) {
      formateCatalog(items, key);
    } else {
      delete item[key];
    }
  });
}
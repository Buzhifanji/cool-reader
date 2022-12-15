import { createEle } from "./dom"
import DefaultBookCover from 'src/assets/book_cover.png';

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

export const handleCover = (url: string) => url ? url : DefaultBookCover;

import { AutoSizeVirtualItemType, fn } from './type'

export const throttle = (fn: fn) => {
  let timer: any = null
  return function (...args: Array<unknown>) {
    if (timer) {
      return
    }
    timer = window.requestAnimationFrame(() => {
      fn(...args)
      timer = null
    })
  }
}
export const findStartByIndex = (list: Array<AutoSizeVirtualItemType>, target: number) => {
  let low = 0
  let high = list.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const { top, bottom } = list[mid]
    if (target >= top && target <= bottom) {
      high = mid
      break
    } else if (target < top) {
      high = mid - 1
    } else if (target > bottom) {
      low = mid + 1
    }
  }
  return high
}

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

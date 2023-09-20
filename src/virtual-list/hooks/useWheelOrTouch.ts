import { useEffect } from 'react'
import { isMobileDevice } from '../utils'

let curY = 0

export const useWheelOrTouch = (dom: HTMLDivElement, targetDom: HTMLDivElement) => {
  const handleWheel = (e: WheelEvent) => {
    if (targetDom) {
      const { scrollTop } = targetDom
      targetDom.scrollTo(0, Math.max(0, scrollTop - e.deltaY))
      e.preventDefault()
      return false
    }
  }
  const handleTouchMove = (e: TouchEvent) => {
    const { pageY } = e.touches[0]
    const len = pageY - curY
    if (targetDom) {
      const { scrollHeight, clientHeight, scrollTop } = targetDom
      const target = (scrollHeight * len) / clientHeight
      targetDom.scrollTo(0, scrollTop + target)
    }
    curY = pageY

    e.preventDefault()
    return false
  }
  const handleTouchEnd = () => {
    removeEvent()
    curY = 0
  }
  const addEvent = () => {
    dom.addEventListener('touchend', handleTouchEnd)
    dom.addEventListener('touchmove', handleTouchMove, { passive: false })
  }
  const removeEvent = () => {
    dom.removeEventListener('touchend', handleTouchEnd)
    dom.removeEventListener('touchmove', handleTouchMove)
  }
  const handleTouchStart = (e: TouchEvent) => {
    const { pageY } = e.touches[0]
    curY = pageY
    addEvent()
  }
  useEffect(() => {
    if (dom) {
      if (isMobileDevice()) {
        dom.addEventListener('touchstart', handleTouchStart, { passive: false })
      } else {
        dom.addEventListener('wheel', handleWheel)
      }
    }
    return () => {
      if (dom) {
        if (isMobileDevice()) {
          dom.removeEventListener('touchstart', handleTouchStart)
        } else {
          dom.removeEventListener('wheel', handleWheel)
        }
      }
    }
  }, [dom])
  return {
    handleTouchStart
  }
}

import { useEffect, useRef, useState } from 'react'

let curY = 0
let isDown = false

export const useBar = (dom: HTMLDivElement, moveDom: HTMLDivElement, reverse = false) => {
  const timer = useRef<any>(null)
  const [showBar, setShowBar] = useState<boolean>(false)
  const clearShowBar = () => {
    timer.current = setTimeout(() => {
      if (timer.current) {
        setShowBar(false)
        clearTimeout(timer.current)
        timer.current = null
      }
    }, 2000)
  }
  const handleShowBar = () => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    setShowBar(true)
    clearShowBar()
  }
  const dealMouseUp = () => {
    if (isDown) {
      curY = 0
      isDown = false
      removeEvent()
    }
  }
  const dealMouseMove = (e: MouseEvent) => {
    if (isDown) {
      handleShowBar()
      const len = e.pageY - curY
      curY = e.pageY
      if (moveDom) {
        const { scrollHeight, clientHeight, scrollTop } = moveDom
        const target = (scrollHeight * len) / clientHeight
        if (reverse) {
          moveDom.scrollTo(0, scrollTop - target)
        } else {
          moveDom.scrollTo(0, scrollTop + target)
        }
      }
      e.preventDefault()
    }
  }
  const removeEvent = () => {
    if (dom) {
      document.removeEventListener('mouseup', dealMouseUp)
      dom.removeEventListener('mouseup', dealMouseUp)

      document.removeEventListener('mousemove', dealMouseMove)
    }
  }
  const addEvent = () => {
    document.addEventListener('mouseup', dealMouseUp)
    dom.addEventListener('mouseup', dealMouseUp)

    document.addEventListener('mousemove', dealMouseMove)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    curY = e.pageY
    isDown = true
    addEvent()
  }
  useEffect(() => {
    return () => {
      removeEvent()
    }
  }, [dom])
  return {
    showBar,
    handleShowBar,
    handleMouseDown
  }
}

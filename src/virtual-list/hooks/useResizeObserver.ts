import { useEffect, useState } from 'react'

export const useResizeObserver = (dom: HTMLElement) => {
  const [size, setSize] = useState<number>(0)
  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      if (entry.contentRect) {
        setSize(old => old + 1)
      }
    }
  })
  useEffect(() => {
    if (dom) {
      resizeObserver.observe(dom)
    }
    return () => {
      if (dom) {
        resizeObserver.unobserve(dom)
      }
    }
  }, [dom])
  return size
}

import { useEffect } from 'react'

export const useScrollToTop = (dom: HTMLDivElement, scrollToTop: number) => {
  useEffect(() => {
    if (dom) {
      dom.scrollTo(0, 0)
    }
  }, [scrollToTop])
}

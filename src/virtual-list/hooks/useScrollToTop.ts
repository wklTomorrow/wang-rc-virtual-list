import { useEffect } from "react";

export const useScrollToTop = (dom: HTMLDivElement, scrollToTop: number) => {
  useEffect(() => {
    if (dom) {
      dom.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [scrollToTop]);
};

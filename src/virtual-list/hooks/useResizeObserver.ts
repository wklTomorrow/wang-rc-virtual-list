import { useEffect, useRef, useState } from "react";

export const useResizeObserver = (dom: HTMLElement) => {
  const [size, setSize] = useState<number>(0);
  const heightRef = useRef<number>(0);

  let resizeObserver: any = null;
  const config = {
    attributes: true,
    childList: true,
    subtree: true,
  };
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setSize((old) => old + 1);
        }
      }
    });
  } else {
    const callback = function () {
      if (dom.offsetHeight !== heightRef.current) {
        heightRef.current = dom.offsetHeight;
        setSize((old) => old + 1);
      }
    };
    resizeObserver = new MutationObserver(callback);
  }

  useEffect(() => {
    if (dom) {
      heightRef.current = dom.offsetHeight;
      resizeObserver.observe(dom, config);
    }
    return () => {
      if (dom) {
        resizeObserver?.unobserve(dom);
        resizeObserver?.disconnect();
      }
    };
  }, [dom]);
  return size;
};

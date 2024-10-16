import { useCallback, useEffect, useRef } from "react";
// import { nextTickTask } from './nextTickTask';

/**
 * 让鼠标滚轮和触控板反向滚动
 */
export function useMouseWheelReverse({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const isWheeling = useRef<boolean>(false);

  const handleWheel = useCallback(
    function (event: WheelEvent) {
      if (isWheeling.current) {
        return;
      }

      isWheeling.current = true;
      event.preventDefault();

      containerRef.current?.scrollBy({
        top: -event.deltaY,
        behavior: "auto",
      });

      isWheeling.current = false;
    },
    [containerRef]
  );

  useEffect(() => {
    const closureRef = containerRef;

    if (closureRef.current) {
      closureRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }
    return () => {
      closureRef.current?.removeEventListener("wheel", handleWheel);
    };
  }, [containerRef, handleWheel]);
}

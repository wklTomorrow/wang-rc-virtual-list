import React, { useEffect, useRef, useState } from "react";
import { useDeepEffect } from "./hooks/useDeepEffect";
import RevertAutoSizeVirtualList from "./revertAutoSizeVirtualList";
import { AutoVirtualItemType } from "./type";
import "./modules/wrapRevertAutoSizeVirtualList.less";
import { useResizeObserver } from "./hooks/useResizeObserver";

function WrapRevertAutoSizeVirtualList<T>(
  props: {
    list: Array<T>;
  } & AutoVirtualItemType<T>
) {
  const { list, height, minSize = 20, itemKey = "", renderItem } = props;

  const [virtual, setVirtual] = useState<boolean>(false);
  const normalEl = useRef<HTMLDivElement>(null);

  const viewCount = Math.min(Math.floor(height / minSize), list.length);

  useDeepEffect(() => {
    if (list?.length > viewCount) {
      setVirtual(true);
    }
  }, [list]);

  const size = useResizeObserver(normalEl.current as HTMLDivElement);

  useEffect(() => {
    if (!virtual && size > 0) {
      const { scrollHeight, clientHeight } =
        normalEl?.current as HTMLDivElement;
      if (scrollHeight > clientHeight) {
        setVirtual(true);
      }
    }
  }, [size, virtual]);

  return (
    <>
      {virtual ? (
        <RevertAutoSizeVirtualList {...props} />
      ) : (
        <div className="normal-list" ref={normalEl}>
          {list.length > 0 &&
            list
              .slice()
              .reverse()
              .map((item) => (
                <div key={item[itemKey as keyof T] as unknown as string}>
                  {renderItem(item)}
                </div>
              ))}
        </div>
      )}
    </>
  );
}

export default WrapRevertAutoSizeVirtualList;

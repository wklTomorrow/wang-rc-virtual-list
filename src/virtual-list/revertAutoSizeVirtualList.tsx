import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { fn, AutoVirtualItemType, AutoSizeVirtualItemType } from "./type";
import { findStartByIndex, throttle } from "./utils";
import "./modules/revertAutoSizeVirtualList.less";
import { useBar } from "./hooks/useBar";
import { useWheelOrTouch } from "./hooks/useWheelOrTouch";
import { useScrollToTop } from "./hooks/useScrollToTop";

function RevertAutoSizeVirtualList<T>({
  list,
  height = 400,
  minSize = 20,
  offset = 6,
  itemKey = "",
  scrollToTop = 0,
  renderItem: renderItemCom,
  renderFooter,
  itemHeight,
  handleScroll,
  scrollToBottom,
}: {
  list: Array<T>;
} & AutoVirtualItemType<T>) {
  const cache = useRef<Array<AutoSizeVirtualItemType>>([]);
  const wrapEl = useRef<HTMLDivElement>(null);
  // const containerEl = useRef<HTMLDivElement>(null);
  const bgEl = useRef<HTMLDivElement>(null);
  const contentEl = useRef<HTMLDivElement>(null);
  const innerEl = useRef<HTMLDivElement>(null);
  const barEl = useRef<HTMLDivElement>(null);
  const cacheSize = useRef<number>(-1);

  const [renderedItem, setRenderItem] = useState<Array<ReactNode>>([]);
  const [style, setStyle] = useState<CSSProperties>({});

  const size = useResizeObserver(innerEl.current as HTMLElement);
  useScrollToTop(contentEl.current as HTMLDivElement, scrollToTop);
  // const { showBar, handleShowBar, handleMouseDown } = useBar(
  //   barEl.current as HTMLDivElement,
  //   containerEl.current as HTMLDivElement,
  //   true
  // );
  // useWheelOrTouch(
  //   wrapEl.current as HTMLDivElement,
  //   containerEl.current as HTMLDivElement
  // );

  const viewCount = Math.min(Math.floor(height / minSize), list.length);

  const renderedItemCom = ({
    item,
    cache,
  }: {
    item: T;
    cache: AutoSizeVirtualItemType;
  }) => {
    return (
      <div
        key={item[itemKey as keyof T] as unknown as string}
        className={"list-item"}
        data-index={cache.index}
        style={{
          minHeight: itemHeight,
        }}
      >
        {renderItemCom(item)}
      </div>
    );
  };

  const updateCells = () => {
    if (innerEl.current && cache.current.length) {
      const listItems = innerEl.current.querySelectorAll(".list-item");
      if (listItems.length === 0) {
        return;
      }
      const lastIndex = +(listItems[listItems.length - 1].getAttribute(
        "data-index"
      ) as string);
      // const firstIndex = +(listItems[0].getAttribute("data-index") as string);
      // if (
      //   cache.current[lastIndex].bottom - cache.current[firstIndex].top >
      //   innerEl.current.offsetHeight
      // ) {
      //   return;
      // }
      [...listItems].forEach((listItem) => {
        const rectBox = listItem.getBoundingClientRect();
        const index = +(listItem.getAttribute("data-index") as string);
        const prevItem = cache.current[index - 1];
        const top = prevItem ? prevItem.bottom : 0;
        Object.assign(cache.current[index], {
          height: rectBox.height,
          top,
          bottom: top + rectBox.height,
          isUpdate: true,
        });
      });
      for (let i = lastIndex + 1; i < cache.current.length; i++) {
        const prevItem = cache.current[i - 1];
        const top = prevItem ? prevItem.bottom : 0;
        Object.assign(cache.current[i], {
          top,
          bottom: top + cache.current[i].height,
        });
      }
      if (bgEl.current && contentEl.current) {
        // bgEl.current.setAttribute(
        //   "style",
        //   `height: ${
        //     cache.current[cache.current.length - 1].bottom -
        //     contentEl.current.offsetHeight
        //   }px;`
        // );
      }
    }
  };

  function autoSizeVirtualList({
    itemList,
    rendered,
    renderScrollBar,
    scrollEnd,
  }: {
    itemList: Array<T>;
    rendered: fn;
    renderScrollBar: fn;
    scrollEnd?: fn;
  }) {
    if (
      // containerEl.current &&
      contentEl.current &&
      bgEl.current &&
      itemList.length
    ) {
      const { scrollTop, offsetHeight, clientHeight } = contentEl.current;
      renderScrollBar({
        allHeight: bgEl.current?.offsetHeight,
        // allHeight: bgEl.current?.offsetHeight + contentEl.current.offsetHeight,
        height: offsetHeight,
        top: scrollTop,
      });
      const startIndex = findStartByIndex(cache.current, -scrollTop);
      const endIndex = startIndex + viewCount;
      const startBufferIndex = Math.max(0, startIndex - offset);
      const endBufferIndex = Math.min(itemList.length - 1, endIndex + offset);
      const renderItems = [];
      for (let i = startBufferIndex; i <= endBufferIndex; i++) {
        renderItems.push(
          renderedItemCom({
            item: itemList[i],
            cache: cache.current[i],
          })
        );
      }

      updateCells();
      const bottom = cache.current[cache.current.length - 1]?.bottom;
      if (contentEl.current && bottom) {
        const { scrollHeight } = contentEl.current;
        if (
          scrollHeight <= -scrollTop + clientHeight &&
          scrollHeight >= bottom
        ) {
          scrollEnd?.();
        }
      }
      bgEl.current.setAttribute(
        "style",
        `height: ${bottom - contentEl.current.offsetHeight}px;`
      );
      rendered(renderItems, {
        transform: `translate3d(0, -${cache.current[startBufferIndex].top}px, 0px)`,
      });
    }
  }

  const renderItem = useMemo(() => {
    for (let i = 0; i < list.length; i++) {
      if (cache.current[i]) {
        continue;
      }
      const pre = cache.current[i - 1] ? cache.current[i - 1].bottom : 0;
      cache.current.push({
        index: i,
        height: minSize,
        top: pre,
        bottom: pre + minSize,
      });
    }
    return () => {
      autoSizeVirtualList({
        itemList: list,
        rendered: (list, style) => {
          setStyle(style);

          setRenderItem(list);
        },
        renderScrollBar: ({
          allHeight,
          height,
          top,
        }: {
          allHeight: number;
          height: number;
          top: number;
        }) => {
          // const target = (height * height) / allHeight;
          // const bottom = (height * top) / allHeight;
          // if (barEl.current) {
          //   barEl.current.setAttribute(
          //     "style",
          //     `height: ${target}px;bottom: ${bottom}px;`
          //   );
          // }
        },
        scrollEnd: () => {
          scrollToBottom?.();
        },
      });
    };
  }, [JSON.stringify(list)]);

  useEffect(() => {
    if (size && cacheSize.current < size) {
      cacheSize.current = size;
      updateCells();
    }
  }, [size, JSON.stringify(cache)]);

  useEffect(() => {
    if (list.length) {
      renderItem();
    }
  }, [JSON.stringify(list), renderItem]);

  const renderBottom = () => {
    return <>{!!renderFooter && renderFooter}</>;
  };

  return (
    <div className="wrap-virtual" ref={wrapEl} style={{ height }}>
      <div
        style={{
          height: "100%",
        }}
      >
        <div
          className="virtual-content"
          onScroll={throttle((e) => {
            handleScroll?.(e);
            renderItem();
          })}
          ref={contentEl}
        >
          <div className="virtual-inner" ref={innerEl} style={{ ...style }}>
            {renderedItem}
            {renderBottom()}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: 10,
              zIndex: -1,
            }}
          >
            <div className="virtual-bg" ref={bgEl}>
              {renderBottom()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevertAutoSizeVirtualList;

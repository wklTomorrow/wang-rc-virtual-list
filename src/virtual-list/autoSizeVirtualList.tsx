import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useBar } from "./hooks/useBar";
import { useDeepEffect } from "./hooks/useDeepEffect";
import { useResizeObserver } from "./hooks/useResizeObserver";
import { useScrollToTop } from "./hooks/useScrollToTop";
import "./modules/autoSizeVirtualList.less";
import { fn, AutoVirtualItemType, AutoSizeVirtualItemType } from "./type";
import { findStartByIndex, throttle } from "./utils";

function AutoSizeVirtualList<T>({
  list,
  height = 400,
  itemHeight = 70,
  minSize = 20,
  offset = 6,
  itemKey = "",
  scrollToTop = 0,
  renderFooter,
  renderHeader,
  handleScroll,
  renderItem: renderItemCom,
  scrollToBottom,
}: {
  list: Array<T>;
  renderHeader?: ReactNode;
} & AutoVirtualItemType<T>) {
  const cache = useRef<Array<AutoSizeVirtualItemType>>([]);
  const cacheSize = useRef<number>(-1);
  const listEl = useRef<HTMLDivElement>(null);
  const innerEl = useRef<HTMLDivElement>(null);
  const bgEl = useRef<HTMLDivElement>(null);
  const containerEl = useRef<HTMLDivElement>(null);
  const barEl = useRef<HTMLDivElement>(null);
  const headerEl = useRef<HTMLDivElement>(null);

  const [renderedItem, setRenderItem] = useState<Array<ReactNode>>([]);
  const [style, setStyle] = useState<CSSProperties>({});
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const viewCount = Math.min(Math.floor(height / minSize), list.length);

  const size = useResizeObserver(innerEl.current as HTMLDivElement);
  useScrollToTop(listEl.current as HTMLDivElement, scrollToTop);
  const { showBar, handleShowBar, handleMouseDown } = useBar(
    barEl.current as HTMLDivElement,
    listEl.current as HTMLDivElement
  );

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
          minHeight: cache.height || itemHeight,
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
      const firstIndex = +(listItems[0].getAttribute("data-index") as string);
      if (
        cache.current[lastIndex].bottom - cache.current[firstIndex].top >
        innerEl.current.offsetHeight
      ) {
        return;
      }
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
      if (bgEl.current) {
        bgEl.current.setAttribute(
          "style",
          `height: ${cache.current[cache.current.length - 1].bottom}px;`
        );
      }
    }
  };

  useEffect(() => {
    if (size && cacheSize.current < size) {
      cacheSize.current = size;
      updateCells();
    }
  }, [size, JSON.stringify(cache)]);

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
    if (listEl.current && itemList.length) {
      const { scrollTop, clientHeight, offsetHeight } = listEl.current;
      renderScrollBar({
        allHeight: containerEl.current?.offsetHeight,
        height: offsetHeight,
        top: scrollTop,
      });
      const start = findStartByIndex(cache.current, scrollTop);
      const startIndex = Math.max(0, start - offset);
      const endIndex = Math.min(
        itemList.length,
        startIndex + viewCount + offset
      );
      const renderItems = [];
      for (let i = startIndex; i < endIndex; i++) {
        renderItems.push(
          renderedItemCom({
            item: itemList[i],
            cache: cache.current[i],
          })
        );
      }

      updateCells();

      const bottom = cache.current[cache.current.length - 1]?.bottom;
      if (bottom) {
        const { clientHeight: curHeight } =
          containerEl.current as HTMLDivElement;
        if (curHeight <= scrollTop + clientHeight && curHeight >= bottom) {
          scrollEnd?.();
        }
      }

      if (bgEl.current) {
        bgEl.current.setAttribute("style", `height: ${bottom}px;`);
      }
      let header = headerHeight;
      if (renderHeader && !headerHeight) {
        header = headerEl.current?.clientHeight as number;
      }
      rendered(renderItems, {
        transform: `translateY(${cache.current[startIndex].top + header}px)`,
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
        height: itemHeight,
        top: pre,
        bottom: pre + itemHeight,
      });
    }
    return () => {
      autoSizeVirtualList({
        itemList: list,
        rendered: (item, style) => {
          setRenderItem(item);
          setStyle(style);
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
          const target = (height * height) / allHeight;
          const scrollTop = (height * top) / allHeight;
          if (barEl.current) {
            barEl.current.setAttribute(
              "style",
              `height: ${target}px;top: ${scrollTop}px;`
            );
          }
        },
        scrollEnd: () => {
          scrollToBottom?.();
        },
      });
    };
  }, [JSON.stringify(list)]);

  useDeepEffect(() => {
    if (list.length) {
      renderItem();
    }
  }, [list]);

  useEffect(() => {
    if (headerEl.current) {
      setHeaderHeight(headerEl.current.clientHeight);
    }
  }, []);

  return (
    <div className="auto-virtual" style={{ height }}>
      <div
        className="auto-virtual-list"
        ref={listEl}
        onScroll={throttle((e) => {
          handleScroll?.(e);
          renderItem();
          handleShowBar();
        })}
      >
        <div ref={containerEl}>
          {!!renderHeader && <div ref={headerEl}>{renderHeader}</div>}
          <div ref={bgEl}></div>
          {!!renderFooter && renderFooter}
        </div>
        <div
          className="auto-virtual-list_container"
          ref={innerEl}
          style={{ ...style }}
        >
          {renderedItem}
        </div>
      </div>
      <div
        style={{
          visibility: showBar ? "visible" : "hidden",
        }}
      >
        <div
          ref={barEl}
          className="auto-virtual-bar"
          onMouseDown={handleMouseDown}
        ></div>
      </div>
    </div>
  );
}

export default AutoSizeVirtualList;

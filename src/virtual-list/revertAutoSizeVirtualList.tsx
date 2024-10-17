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
import { useMouseWheelReverse } from "./hooks/mouseWheelReverse";

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
  const cacheTrans = useRef<any>({});
  const cacheDom = useRef<any>({});

  const [renderedItem, setRenderItem] = useState<Array<ReactNode>>([]);
  const [style, setStyle] = useState<CSSProperties>({});
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [renderList, setRenderList] = useState<T[]>([]);

  const [addOne, setAddOne] = useState<T | null>(null);
  const timerRef = useRef<any>();

  const viewCount = Math.min(Math.floor(height / minSize), list.length);

  const size = useResizeObserver(innerEl.current as HTMLDivElement);
  useScrollToTop(listEl.current as HTMLDivElement, scrollToTop);
  const { showBar, handleShowBar, handleMouseDown } = useBar(
    barEl.current as HTMLDivElement,
    listEl.current as HTMLDivElement,
    true
  );
  useMouseWheelReverse({ containerRef: listEl });
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const RenderedItemCom = ({
    item,
    cache,
    i,
  }: {
    item: T;
    i: number;
    cache: AutoSizeVirtualItemType;
  }) => {
    const dom = useRef<any>(null);
    const size = useResizeObserver(dom.current as HTMLDivElement);
    useEffect(() => {
      cacheDom.current[i] = {
        height: dom.current.offsetHeight,
      };
    }, []);
    useEffect(() => {
      cacheDom.current[i] = {
        height: dom.current.offsetHeight,
      };
    }, [size, i]);

    return (
      <div
        ref={dom}
        key={item[itemKey as keyof T] as unknown as string}
        className={"list-item"}
        data-index={cache.index}
        style={{
          minHeight: itemHeight,
          transform: "rotate(180deg)",
          height: cacheDom.current[i]
            ? cacheDom.current[i].height
            : "max-content",
        }}
      >
        {renderItemCom(item)}
      </div>
    );
  };

  const updateCells = (scroll = false) => {
    if (innerEl.current && cache.current.length) {
      if (scroll) {
        return;
      }
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
        let index = +(listItem.getAttribute("data-index") as string);
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
        renderItems.push({
          item: itemList[i],
          cache: cache.current[i],
          i,
        });
      }

      updateCells();

      const bottom = cache.current[cache.current.length - 1]?.bottom;
      if (bottom) {
        const { clientHeight: curHeight } =
          containerEl.current as HTMLDivElement;
        if (curHeight <= scrollTop + clientHeight + 5 && curHeight >= bottom) {
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
      let trans = cacheTrans.current[[startIndex, "-", endIndex].join("")];
      if (!trans) {
        trans = cacheTrans.current[
          [startIndex, "-", endIndex].join("")
        ] = `translate3d(0, ${cache.current[startIndex].top + header}px, 0)`;
      }

      rendered(renderItems, {
        transform: trans,
      });
    }
  }

  const renderItem = useMemo(() => {
    for (let i = 0; i < renderList.length; i++) {
      if (cache.current[i]) {
        continue;
      }
      const pre = cache.current[i - 1] ? cache.current[i - 1].bottom : 0;
      console.log(renderList[i]);
      cache.current.push({
        index: i,
        height: itemHeight,
        top: pre,
        bottom: pre + itemHeight,
        key: renderList[i][itemKey],
      });
    }
    return () => {
      autoSizeVirtualList({
        itemList: renderList,
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
  }, [JSON.stringify(renderList)]);

  useDeepEffect(() => {
    if (list.length) {
      if (
        cache.current.length &&
        cache.current[0]?.key !== list[0][itemKey] &&
        listEl.current?.scrollTop
      ) {
        setAddOne(list[0]);
      } else {
        setRenderList(list);
      }
    }
  }, [list]);

  useEffect(() => {
    if (renderList.length) {
      cacheTrans.current = {};
      cacheDom.current = {};
      renderItem();
    }
  }, [renderList.length]);

  useEffect(() => {
    if (size && cacheSize.current < size) {
      cacheSize.current = size;
      updateCells();
    }
  }, [size, JSON.stringify(cache)]);

  useEffect(() => {
    if (headerEl.current) {
      setHeaderHeight(headerEl.current.clientHeight);
    }
    return () => {
      clearTimer();
    };
  }, []);

  const rotate = {
    transform: "rotate(180deg)",
  };

  return (
    <div className="auto-virtual" style={{ height, ...rotate }}>
      <div
        className="auto-virtual-list"
        ref={listEl}
        onScroll={throttle((e) => {
          handleScroll?.(e);
          renderItem();
          handleShowBar();
          const one = addOne;
          if (!e.target?.scrollTop && one) {
            timerRef.current = setTimeout(() => {
              setRenderList((old) => [one, ...old]);
              clearTimer();
            });
          }

          setAddOne(null);
        })}
      >
        <div ref={containerEl}>
          {!!renderHeader && (
            <div ref={headerEl} style={{ ...rotate }}>
              {renderHeader}
            </div>
          )}
          <div ref={bgEl}></div>
          {!!renderFooter && <div style={{ ...rotate }}>{renderFooter}</div>}
        </div>
        <div
          className="auto-virtual-list_container"
          ref={innerEl}
          style={{ ...style }}
        >
          {renderedItem.map(({ item, cache, i }) => (
            <RenderedItemCom item={item} cache={cache} i={i} />
          ))}
        </div>
      </div>
      <div
        style={{
          visibility: showBar ? "visible" : "hidden",
        }}
      >
        <div
          ref={barEl}
          className="auto-virtual-bar reverse"
          onMouseDown={handleMouseDown}
        ></div>
      </div>
    </div>
  );
}

export default AutoSizeVirtualList;

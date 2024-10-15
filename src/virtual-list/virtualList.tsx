/**
 * 固定高度
 */
import React, { useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { fn, AutoVirtualItemType } from "./type";
import "./modules/virtualList.less";
import { throttle } from "./utils";
import { useBar } from "./hooks/useBar";
import { useDeepEffect } from "./hooks/useDeepEffect";
import { useScrollToTop } from "./hooks/useScrollToTop";

function VirtualList<T>({
  height = 400,
  minSize = 20,
  itemHeight = 40,
  offset = 6,
  list = [],
  scrollToTop = 0,
  itemKey = "",
  renderHeader,
  renderFooter,
  renderItem,
  scrollToBottom,
  handleScroll,
}: {
  list: Array<T>;
  renderHeader?: ReactNode;
} & AutoVirtualItemType<T>) {
  const containerEl = useRef<HTMLDivElement>(null);
  const bgEl = useRef<HTMLDivElement>(null);
  const barEl = useRef<HTMLDivElement>(null);
  const scrollEl = useRef<HTMLDivElement>(null);
  const headerEl = useRef<HTMLDivElement>(null);
  const [showList, setList] = useState<Array<T>>([]);
  const [startIndex, setStart] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const viewCnt = Math.min(Math.floor(height / minSize), list.length);

  function dealVirtualList({
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
    if (containerEl.current && itemList.length) {
      const { scrollTop, offsetHeight, clientHeight } = containerEl.current;
      renderScrollBar({
        allHeight: scrollEl.current?.offsetHeight,
        height: offsetHeight,
        top: scrollTop,
      });
      if (
        (scrollEl.current?.clientHeight as number) <=
        scrollTop + clientHeight
      ) {
        scrollEnd?.();
      }
      const newStartIndex = Math.floor(scrollTop / itemHeight);
      const startIndex = Math.max(0, newStartIndex - offset);
      const endIndex = Math.min(itemList.length, startIndex + viewCnt);
      const renderList = [];
      for (let i = startIndex; i < endIndex; i++) {
        renderList.push(itemList[i]);
      }
      rendered(renderList, startIndex);
    }
  }

  const render = useMemo(() => {
    return () => {
      dealVirtualList({
        itemList: list,
        rendered: (list, index) => {
          setList(list);
          setStart(index);
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
      bgEl?.current?.setAttribute(
        "style",
        `height: ${list.length * itemHeight}px;`
      );
    }
    render();
  }, [list]);

  const { showBar, handleShowBar, handleMouseDown } = useBar(
    barEl.current as HTMLDivElement,
    containerEl.current as HTMLDivElement
  );

  useEffect(() => {
    if (headerEl.current) {
      setHeaderHeight(headerEl.current.clientHeight);
    }
  }, []);

  useScrollToTop(containerEl.current as HTMLDivElement, scrollToTop);

  return (
    <div className="wrap-virtual" style={{ height }}>
      <div
        ref={containerEl}
        className="virtual-container"
        onScroll={throttle((e) => {
          handleShowBar();
          handleScroll?.(e);
          render();
        })}
      >
        <div ref={scrollEl}>
          {!!renderHeader && <div ref={headerEl}>{renderHeader}</div>}
          <div ref={bgEl}></div>
          {!!renderFooter && renderFooter}
        </div>
        {showList.length > 0 && (
          <div
            className="virtual-container_content"
            style={{
              transform: `translate3d(0, ${
                startIndex * itemHeight + headerHeight
              }px, 0)`,
            }}
          >
            {showList.map((item: T) => (
              <div
                key={item[itemKey as keyof T] as unknown as string}
                className="list-item"
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          visibility: showBar ? "visible" : "hidden",
        }}
      >
        <div
          ref={barEl}
          className="wrap-virtual_bar"
          onMouseDown={handleMouseDown}
        ></div>
      </div>
    </div>
  );
}

export default VirtualList;

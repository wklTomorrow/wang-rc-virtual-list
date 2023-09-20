import React from "react";
import { Button, Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { VirtualList } from "../../src/index";

type ItemType = {
  id: number;
  index: number;
};

const SimpleDemo = () => {
  const [list1, setList1] = useState<Array<ItemType>>([]);
  const [list2, setList2] = useState<Array<ItemType>>([]);
  const [scrollToTop1, setScroll1] = useState<number>(0);
  const [scrollToTop2, setScroll2] = useState<number>(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      setList2((old: any) => {
        const list = Array.from({ length: 100 }, (_, i: number) => ({
          id: Math.random(),
          index: old.length + i,
        }));
        return [...old, ...list];
      });
    }, 2000);
  };
  useEffect(() => {
    const list = Array.from({ length: 100 }, (_, i: number) => ({
      id: Math.random(),
      index: +i,
    }));
    setList2(list);
    setList1(list);
  }, []);
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card
          title="use"
          extra={
            <Button
              type="primary"
              onClick={() => {
                setScroll1((old) => old + 1);
              }}
            >
              top
            </Button>
          }
        >
          <div
            style={{
              height: 400,
              outline: "1px solid seagreen",
            }}
          >
            {list1.length && (
              <VirtualList<ItemType>
                list={list1}
                height={400}
                itemHeight={40}
                scrollToTop={scrollToTop1}
                itemKey="id"
                renderItem={({ id, index }: ItemType) => (
                  <div
                    style={{
                      outline: "1px solid red",
                      outlineOffset: -2,
                      backgroundColor: "#fff",
                      height: 40,
                    }}
                  >
                    {index}
                  </div>
                )}
              />
            )}
          </div>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title="set header、end and load more"
          extra={
            <Button
              type="primary"
              onClick={() => {
                setScroll2((old) => old + 1);
              }}
            >
              top
            </Button>
          }
        >
          <div
            style={{
              height: 400,
              outline: "1px solid seagreen",
            }}
          >
            {list2.length && (
              <VirtualList<ItemType>
                list={list2}
                height={400}
                itemHeight={40}
                scrollToBottom={scrollToBottom}
                scrollToTop={scrollToTop2}
                itemKey="id"
                renderFooter={
                  <div style={{ textAlign: "center" }}>loading...</div>
                }
                renderHeader={<div style={{ textAlign: "center" }}>header</div>}
                renderItem={({ index }: ItemType) => (
                  <div
                    style={{
                      outline: "1px solid red",
                      outlineOffset: -2,
                      backgroundColor: "#fff",
                      height: 40,
                    }}
                  >
                    {index}
                  </div>
                )}
              />
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default SimpleDemo;

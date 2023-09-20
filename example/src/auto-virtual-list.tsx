import { Button, Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { AutoSizeVirtualList } from "../../src/index";

const randomIncludes = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

type ItemType = {
  name: string;
  id: number;
  height: number;
};

const AutoList = () => {
  const [list1, setList1] = useState<Array<ItemType>>([]);
  const [list2, setList2] = useState<Array<ItemType>>([]);
  const [scrollToTop1, setScroll1] = useState<number>(0);
  const [scrollToTop2, setScroll2] = useState<number>(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      setList2((old: any) => {
        const items = Array.from({ length: 100 }).map((item, i) => ({
          name: `item ${old.length + i}`,
          id: Math.random(),
          height: randomIncludes(40, 120),
        }));
        return [...old, ...items];
      });
    }, 2000);
  };
  useEffect(() => {
    const items = Array.from({ length: 100 }).map((item, i) => ({
      name: `item ${i}`,
      id: Math.random(),
      height: randomIncludes(40, 120),
    }));
    setList1(items);
    setList2(items);
  }, []);
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card
          title={"base use"}
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
              <AutoSizeVirtualList<ItemType>
                list={list1}
                height={400}
                itemHeight={40}
                itemKey={"id"}
                scrollToTop={scrollToTop1}
                renderItem={({ name, height }: ItemType) => (
                  <div
                    style={{
                      outline: "1px solid red",
                      outlineOffset: -2,
                      height: height,
                      backgroundColor: "#fff",
                    }}
                  >
                    {name}
                  </div>
                )}
              />
            )}
          </div>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title={"set header、end and load more"}
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
              <AutoSizeVirtualList<ItemType>
                list={list2}
                height={400}
                itemHeight={40}
                itemKey={"id"}
                scrollToTop={scrollToTop2}
                scrollToBottom={scrollToBottom}
                renderFooter={
                  <div style={{ textAlign: "center" }}>loading...</div>
                }
                renderHeader={
                  <div style={{ textAlign: "center" }}>header</div>
                }
                renderItem={({ name, height }: ItemType) => (
                  <div
                    style={{
                      outline: "1px solid red",
                      outlineOffset: -2,
                      height: height,
                      backgroundColor: "#fff",
                    }}
                  >
                    {name}
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

export default AutoList;

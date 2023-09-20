import { Button, Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { RevertAutoSizeVirtualList } from "../../src/index";

const randomIncludes = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

type ItemType = {
  name: string;
  id: number;
  height: number;
};

const AutoReverseList = () => {
  const [list1, setList1] = useState<Array<ItemType>>([]);
  const [list2, setList2] = useState<Array<ItemType>>([]);
  const [list3, setList3] = useState<Array<ItemType>>([]);
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
    const item3 = Array.from({ length: 4 }).map((item, i) => ({
      name: `item ${i}`,
      id: Math.random(),
      height: randomIncludes(40, 120),
    }));
    setList3(item3);
    setTimeout(() => {
      setList3((old) => {
        const item3 = Array.from({ length: 4 }).map((item, i) => ({
          name: `item ${old.length + i}`,
          id: Math.random(),
          height: randomIncludes(40, 120),
        }));
        return [...old, ...item3];
      });
    }, 3000);
  }, []);

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card
          title={"use"}
          style={{
            marginBottom: 16,
          }}
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
              <RevertAutoSizeVirtualList<ItemType>
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
          title={"set footer and load more"}
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
              <RevertAutoSizeVirtualList<ItemType>
                list={list2}
                height={400}
                itemHeight={40}
                itemKey={"id"}
                scrollToTop={scrollToTop2}
                renderFooter={
                  <div style={{ textAlign: "center" }}>loading...</div>
                }
                scrollToBottom={scrollToBottom}
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
        <Card title="chat history">
          <div
            style={{
              height: 400,
              outline: "1px solid seagreen",
            }}
          >
            {list3.length > 0 && (
              <RevertAutoSizeVirtualList<ItemType>
                list={list3}
                height={400}
                itemHeight={40}
                itemKey={"id"}
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

export default AutoReverseList;

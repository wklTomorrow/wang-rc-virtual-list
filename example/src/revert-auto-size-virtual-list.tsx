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

const SimpleDemo = () => {
  const [list1, setList1] = useState<Array<ItemType>>([]);
  const [list2, setList2] = useState<Array<ItemType>>([]);
  const [list3, setList3] = useState<Array<ItemType>>([]);
  const [list4, setList4] = useState<Array<ItemType>>([]);
  const [scrollToTop1, setScroll1] = useState<number>(0);
  const [scrollToTop2, setScroll2] = useState<number>(0);
  const [scrollToTop4, setScroll4] = useState<number>(0);

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
    const items = Array.from({ length: 100 }).map((item, i) => {
      if (i % 10 === 0) {
        return {
          name: `item ${i}`,
          id: Math.random(),
          height: randomIncludes(40, 120),
          img: "https://cos.ap-shanghai.myqcloud.com/2d6e-shanghai-007-sharedv4-05-1303031839/ae04-1600010225/a29f-BqD5cL_3664627/d8839405f55f85b2076e9513b5aaa01d-258679.png",
        };
      }
      return {
        name: `item ${i}`,
        id: Math.random(),
        height: randomIncludes(40, 120),
      };
    });
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
    const item4 = Array.from({ length: 1 }).map((item, i) => ({
      name: `item ${i}`,
      id: Math.random(),
      height: randomIncludes(40, 120),
    }));
    setList4(item4);
  }, []);

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card
          title={"基本使用"}
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
              回到顶部
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
                renderFooter={<>hello world</>}
                renderItem={({ name, height, img }: ItemType) => (
                  <div
                    style={{
                      outline: "1px solid red",
                      outlineOffset: -2,
                      minHeight: 40,
                      backgroundColor: "#fff",
                    }}
                    onClick={() => {
                      console.log("hello world");
                    }}
                  >
                    {img ? (
                      <img
                        src={img}
                        style={{
                          width: "100%",
                        }}
                        onClick={() => {
                          console.log("img");
                        }}
                      />
                    ) : (
                      <>{name}</>
                    )}
                  </div>
                )}
              />
            )}
          </div>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title={"设置尾部、滚动加载"}
          extra={
            <Button
              type="primary"
              onClick={() => {
                setScroll2((old) => old + 1);
              }}
            >
              回到顶部
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
                  <div style={{ textAlign: "center" }}>拼命加载中...</div>
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
        <Card title="数量较少时兼容，用于 IM 聊天记录场景">
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
      <Col span={12}>
        <Card
          title="列子"
          extra={
            <Button
              type="primary"
              onClick={() => {
                setTimeout(() => {
                  setList4((old) => {
                    const item4 = Array.from({ length: 1 }).map((item, i) => {
                      if (i % 10 === 0) {
                        return {
                          name: `item ${i}`,
                          id: Math.random(),
                          height: randomIncludes(40, 120),
                          img: "https://cos.ap-shanghai.myqcloud.com/2d6e-shanghai-007-sharedv4-05-1303031839/ae04-1600010225/a29f-BqD5cL_3664627/d8839405f55f85b2076e9513b5aaa01d-258679.png",
                        };
                      }
                      return {
                        name: `item ${old.length + i}`,
                        id: Math.random(),
                        height: randomIncludes(40, 120),
                      };
                    });
                    return [...item4, ...old];
                  });
                  setScroll4((old) => old + 1);
                }, 1000);
              }}
            >
              添加一
            </Button>
          }
        >
          <div
            style={{
              height: 400,
              outline: "1px solid seagreen",
            }}
          >
            {list4.length > 0 && (
              <RevertAutoSizeVirtualList<ItemType>
                list={list4}
                height={400}
                itemHeight={40}
                itemKey={"id"}
                scrollToTop={scrollToTop4}
                renderItem={({ name, height, img }: ItemType) => (
                  <div
                    style={{
                      outline: "1px solid red",
                      outlineOffset: -2,
                      minHeight: 40,
                      backgroundColor: "#fff",
                    }}
                  >
                    {img ? (
                      <img
                        src={img}
                        style={{
                          width: "100%",
                        }}
                        onClick={() => {
                          console.log("img");
                        }}
                      />
                    ) : (
                      <>{name}</>
                    )}
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

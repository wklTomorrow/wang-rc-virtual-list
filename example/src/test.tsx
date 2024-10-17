import React, { useRef, useState } from "react";
import {
  AutoSizeVirtualList,
  RevertAutoSizeVirtualList,
} from "../../src/index";

enum ConEnum {
  Text = "Text",
  Img = "Img",
}

const wrapList = [
  {
    type: ConEnum.Text,
    text: "上新预告列表页h5",
  },
  {
    type: ConEnum.Text,
    text: "上新预告列表页h5上新预告列表页h5上新预告列表页h5上新预告列表页h5",
  },
  {
    type: ConEnum.Text,
    text: "认识航空航天-CopyFromOnline",
  },
  {
    type: ConEnum.Text,
    text: "认识航空航天-CopyFromOnline认识航空航天-CopyFromOnline认识航空航天-CopyFromOnline认识航空航天-CopyFromOnline",
  },
];

const imgList = [
  {
    type: ConEnum.Img,
    img: "https://conan-test.fbcontent.cn/conan-oss-resource/4sy085ha81719401766061.png",
  },
  {
    type: ConEnum.Img,
    img: "https://conan-test.fbcontent.cn/conan-oss-resource/meh8ljapm1728901520245.jpg",
  },
  {
    type: ConEnum.Img,
    img: "https://conan-test.fbcontent.cn/conan-xross-resource/izq1emtm3wgh6p2/rcnzxc8a5i2em7a.png",
  },
];

const startList = [
  ...wrapList,
  ...imgList,
  ...wrapList,
  ...imgList,
  ...wrapList,
  ...imgList,
  ...wrapList,
  ...imgList,
];

let idRef = 0;

const start = startList.map((r) => {
  idRef = idRef + 1;
  return {
    ...r,
    key: Math.random(),
    id: idRef,
  };
});

const Index = () => {
  const loading = useRef(false);
  const [key, setKey] = useState(0);

  const [list, setList] = useState(start);
  const [scrollToTop, setScrollToTop] = useState(0);
  const renderItem = ({ type, img, text, id }: any) => {
    if (type === ConEnum.Img) {
      return (
        <div
          style={{
            outline: "1px solid red",
            outlineOffset: -2,
            minHeight: 60,
            display: "flex",
          }}
        >
          <img
            src={img}
            style={{
              maxWidth: 200,
              maxHeight: 200,
            }}
          />
        </div>
      );
    }
    return (
      <div
        style={{
          outline: "1px solid red",
          outlineOffset: -2,
          minHeight: 60,
        }}
      >
        {text}
        <div>第{id}个</div>
      </div>
    );
  };
  return (
    <div>
      <RevertAutoSizeVirtualList
        // key={key}
        height={400}
        list={list}
        itemKey="id"
        minSize={40}
        itemHeight={60}
        renderItem={renderItem}
        renderFooter={
          <div
            style={{
              height: 60,
            }}
          >
            hello world
          </div>
        }
        scrollToTop={scrollToTop}
        scrollToBottom={() => {
          console.log("end");
          if (!loading.current) {
            loading.current = true;
            setTimeout(() => {
              loading.current = false;
              setList((old) => [
                ...old,
                ...startList.map((s) => {
                  idRef = idRef + 1;
                  return {
                    ...s,
                    id: idRef,
                  };
                }),
              ]);
            }, 1000);
          }
        }}
      />
      <div
        style={{
          marginTop: 40,
        }}
        onClick={() => {
          setList((old) => {
            idRef = idRef + 1;
            return [{ ...wrapList[0], id: idRef, key: Math.random() }, ...old];
          });
          setScrollToTop((old) => old + 1);
          // setKey((old) => old + 1);
        }}
      >
        添加一个文本
      </div>
      <div
        style={{
          marginTop: 40,
        }}
        onClick={() => {
          setList((old) => {
            idRef = idRef + 1;
            return [{ ...imgList[0], id: idRef, key: Math.random() }, ...old];
          });
          setScrollToTop((old) => old + 1);
          // setKey((old) => old + 1);
        }}
      >
        添加一个图片
      </div>
    </div>
  );
};

export default Index;

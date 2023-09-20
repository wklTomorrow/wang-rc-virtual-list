import React from "react";
import {
  VirtualList,
  AutoSizeVirtualList,
  RevertAutoSizeVirtualList,
} from "../../src/index";
import AutoList from "./auto-virtual-list";
import AutoReverseList from "./revert-auto-size-virtual-list";
import SimpleDemo from "./simple-demo";

const Index = () => {
  return (
    <div>
      <SimpleDemo />
      <AutoList />
      <AutoReverseList />
    </div>
  );
};

export default Index;

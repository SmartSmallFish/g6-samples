import React from "react";
import Editor, { Api } from "@/index";
// import styles from "./index.less";

const data = {
  nodes: [
    {
      id: "0",
      groupId: "p1",
      label: "Node1",
      x: 50,
      y: 50,
    },
    {
      id: "1",
      groupId: "p1",
      label: "Node2",
      x: 50,
      y: 200,
    },
    {
      id: "2",
      label: "Node3",
      x: 250,
      y: 400,
    },
    {
      id: "3",
      type: "bizErField",
      x: 650,
      y: 100,
      data: {
        label: "优惠券列表",
        value: "coupons",
      },
      comboId: "combo1",
    },
    {
      id: "4",
      type: "bizErField",
      x: 650,
      y: 140,
      data: {
        label: "会员信息",
        value: "member",
      },
      comboId: "combo1",
    },
  ],
  edges: [
    {
      label: "Label",
      source: "2",
      sourceAnchor: 0,
      target: "1",
      targetAnchor: 1,
    },
    { source: "2", target: "combo1" },
  ],
  groups: [
    {
      id: "p1",
    },
  ],
  combos: [
    {
      id: "combo1",
      data: {
        title: "用户信息列表",
        desc: "主体数据",
      },
    },
  ],
};

function App() {
  return (
    <Editor>
      <Api
        // className={styles.graph}
        style={{ position: "relative", height: 600, background: "#f5f5f5" }}
        data={data}
      />
    </Editor>
  );
}

export default App;

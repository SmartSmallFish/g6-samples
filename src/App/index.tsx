import React from "react";
import Editor, { Api, ItemPanel, Item } from "@/index";
import { COMMON_FIELD_WIDTH, COMBO_BORDER } from "@/shape/constants";
import { ComboPanel, NodePanel, EdgePanel, MultiPanel, CanvasPanel } from "./Panel";
import styles from "./index.less";

const data = {
  nodes: [
    {
      id: "0",
      groupId: "p1",
      label: "Node1",
      x: 50,
      y: 50,
      type: "bizFlowNode",
    },
    {
      id: "1",
      groupId: "p1",
      label: "Node2",
      x: 50,
      y: 200,
      type: "bizFlowNode",
    },
    {
      id: "2",
      label: "Node3",
      x: 250,
      y: 400,
      type: "bizFlowNode",
    },
    {
      id: "3",
      type: "bizApiField",
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
      type: "bizApiField",
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
      <div className={styles.editor}>
        <div className={styles.itemPanelWrapper}>
          <ItemPanel className={styles.itemPanel}>
            <Item
              className={styles.item}
              model={{
                type: "circle",
                size: 50,
                label: "circle",
              }}
            >
              <img
                src="https://gw.alicdn.com/tfs/TB1IRuSnRr0gK0jSZFnXXbRRXXa-110-112.png"
                width="55"
                height="56"
                draggable={false}
              />
            </Item>
            <Item
              className={styles.item}
              model={{
                size: [COMMON_FIELD_WIDTH, 70],
                type: "combo-rect",
                data: {
                  title: "接口名",
                  desc: "接口描述",
                },
              }}
            >
              <span className={styles.returnNode}>返回</span>
            </Item>
          </ItemPanel>
        </div>
        <div className={styles.detailPanelWrapper}>
          <div className={styles.detailPanel}>
            <ComboPanel />
            <NodePanel />
            <EdgePanel />
            <MultiPanel />
            <CanvasPanel />
          </div>
        </div>

        <Api className={styles.graph} data={data} />
      </div>
    </Editor>
  );
}

export default App;

import G6 from "@antv/g6";
import { CustomNode, Item } from "@/common/interfaces";
import { setAnchorPointsState } from "@/shape/common/anchor";

const bizApiNode: CustomNode = {
  afterSetState(name: string, value: string | boolean, item: Item) {
    setAnchorPointsState.call(this, name, value, item);
  },

  getAnchorPoints() {
    return [
      [0.5, 0],
      [0.5, 1],
      [0, 0.5],
      [1, 0.5],
    ];
  },
};

G6.registerNode("bizApiNode", bizApiNode, "bizNode");

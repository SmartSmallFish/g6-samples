import G6 from "@antv/g6";
import { ShapeOptions as IShapeOptions } from "@antv/g6/lib/interface/shape";
import { GGroup, NodeModel, CustomNode, Item } from "@/common/interfaces";
import { setAnchorPointsState } from "../common/anchor";

const COMBO_BORDER = 3;
const TITLE_HEIGHT = 30;
const DESC_HEIGHT = 35;
const NODE_FONT_SIZE = 14;
const GAP_HEIGHT = 1;

const titleStyle = {
  fill: "#000000",
  // textAlign: "center",
  textBaseline: "middle",
  fontSize: NODE_FONT_SIZE,
};

const comboRect: IShapeOptions = {
  drawShape(cfg: NodeModel, group: GGroup) {
    const self = this;
    let paddingTop = 5;
    const { data } = cfg;
    if (data.title) {
      paddingTop += TITLE_HEIGHT;
    }
    if (data.desc) {
      paddingTop += DESC_HEIGHT;
    }
    cfg.padding = cfg.padding || [paddingTop, 5, 5, 5];
    const style = self.getShapeStyle(cfg);
    const comboOriginPoint = {
      x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
      y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
    };
    const { x, y } = comboOriginPoint;
    const rect = group.addShape("rect", {
      attrs: {
        ...style,
        x,
        y,
        width: style.width,
        height: style.height,
        fill: "#FFF",
        stroke: "#7947eb",
        lineWidth: COMBO_BORDER,
        radius: 8,
        cursor: "move",
      },
      draggable: true,
      name: "combo-keyShape",
    });

    self.drawTitle(cfg, group, comboOriginPoint);
    self.drawDesc(cfg, group, comboOriginPoint);

    // const { x, y, width, height } = rect.getBBox();

    // const markerPosition = [
    //   { x: x + width / 2, y: y },
    //   { x: x, y: y + height / 2 },
    //   { x: x + width, y: y + height / 2 },
    //   { x: x + width / 2, y: y + height },
    // ];

    // markerPosition.forEach((item, index) => {
    //   group.addShape("marker", {
    //     attrs: {
    //       ...style,
    //       fill: "white",
    //       stroke: style.stroke,
    //       lineDash: [0, 0],
    //       opacity: 1,
    //       x: item.x,
    //       y: item.y,
    //       r: 5,
    //     },
    //     draggable: true,
    //     name: `combo-marker-shape-${index}`,
    //   });
    // });
    return rect;
  },

  drawTitle(cfg: NodeModel, group: GGroup, originPoint: Object) {
    const self = this;
    const style = self.getShapeStyle(cfg);
    const { data } = cfg;
    const { x, y } = originPoint;
    group.addShape("rect", {
      attrs: {
        x: x + COMBO_BORDER,
        y: y + COMBO_BORDER,
        width: style.width - COMBO_BORDER * 2,
        height: TITLE_HEIGHT,
        fill: "#999",
        radius: [8, 8, 0, 0],
        cursor: "move",
      },
      draggable: true,
      name: "combo-title",
    });
    group.addShape("rect", {
      attrs: {
        x: x + COMBO_BORDER / 2,
        y: y + COMBO_BORDER,
        width: style.width - COMBO_BORDER,
        height: TITLE_HEIGHT - GAP_HEIGHT,
        fill: "#FFF",
        radius: [8, 8, 0, 0],
        cursor: "move",
      },
      draggable: true,
      name: "combo-title",
    });
    group.addShape("text", {
      draggable: true,
      attrs: {
        x: x + 10,
        y: y + TITLE_HEIGHT / 2,
        text: data.title,
        ...titleStyle,
        cursor: "move",
      },
    });
  },

  drawDesc(cfg: NodeModel, group: GGroup, originPoint: Object) {
    const self = this;
    const style = self.getShapeStyle(cfg);
    const { data } = cfg;
    const { x, y } = originPoint;
    group.addShape("rect", {
      attrs: {
        x: x + COMBO_BORDER,
        y: y + TITLE_HEIGHT + COMBO_BORDER,
        width: style.width - COMBO_BORDER * 2,
        height: DESC_HEIGHT,
        fill: "#999",
        cursor: "move",
      },
      draggable: true,
      name: "combo-title",
    });
    group.addShape("rect", {
      attrs: {
        x: x + COMBO_BORDER / 2,
        y: y + TITLE_HEIGHT + COMBO_BORDER,
        width: style.width - COMBO_BORDER,
        height: DESC_HEIGHT - GAP_HEIGHT,
        fill: "#FFF",
        cursor: "move",
      },
      draggable: true,
      name: "combo-title",
    });
    group.addShape("text", {
      draggable: true,
      attrs: {
        x: x + 10,
        y: y + TITLE_HEIGHT + DESC_HEIGHT / 2,
        text: data.desc,
        ...titleStyle,
        cursor: "move",
      },
    });
  },

  setState(name: string, value: string | boolean, item: Item) {
    setAnchorPointsState.call(this, name, value, item);
  },

  // afterUpdate(cfg, combo) {},
};
G6.registerCombo("combo-rect", comboRect, "rect");

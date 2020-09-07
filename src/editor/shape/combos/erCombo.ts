import G6 from "@antv/g6";
import { ShapeOptions as IShapeOptions } from "@antv/g6/lib/interface/shape";
import { map, debounce } from "lodash";
import { GGroup, NodeModel, Item } from "@/common/interfaces";
import { getComboOriginPoint } from "@/shape/utils";
import { setAnchorPointsState } from "../common/anchor";
import {
  COMBO_BORDER,
  COMBO_TITLE_HEIGHT,
  COMBO_DESC_HEIGHT,
  COMMON_FIELD_WIDTH,
  COMMON_FIELD_HEIGHT,
  NODE_FONT_SIZE,
  COMNO_FIELD_GAP_HEIGHT,
} from "../constants";

const titleStyle = {
  fill: "#000000",
  textBaseline: "middle",
  fontSize: NODE_FONT_SIZE,
};

const WRAPPER_CLASS_NAME = "combo-wrapper";
const TITLE_SHAPE = 'title-shape';
const DESC_SHAPE = "desc-shape";

interface ComboAttr {
  title: string;
  desc: string;
}
interface OriginPoint {
  x: number;
  y: number;
}

const comboRect: IShapeOptions = {
  drawShape(cfg: NodeModel, group: GGroup) {
    const self = this;
    let paddingTop = 2;
    const { data } = cfg;
    const { title, desc } = data as ComboAttr;
    if (title) {
      paddingTop += COMBO_TITLE_HEIGHT + COMNO_FIELD_GAP_HEIGHT;
    }
    if (desc) {
      paddingTop += COMBO_DESC_HEIGHT + COMNO_FIELD_GAP_HEIGHT;
    }
    cfg.padding = cfg.padding || [paddingTop, 5, 2, 5];
    // cfg.padding = [paddingTop, 5, 2, 5];
    const style = self.getShapeStyle(cfg);
    const comboOriginPoint = getComboOriginPoint(self, cfg);
    const { x, y } = comboOriginPoint;
    const childrenLen = cfg.children ? cfg.children.length : 0;
    const rect = group.addShape("rect", {
      name: "combo-keyShape",
      className: WRAPPER_CLASS_NAME,
      draggable: true,
      attrs: {
        ...style,
        x,
        y,
        width: style.width,
        height: style.height,
        // width: COMMON_FIELD_WIDTH,
        // height:
        //   paddingTop +
        //   COMNO_FIELD_GAP_HEIGHT * 2 +
        //   childrenLen * COMMON_FIELD_HEIGHT,
        fill: "#FFF",
        stroke: "#7947eb",
        lineWidth: COMBO_BORDER,
        radius: 8,
        cursor: "move",
      },
    });

    // self.drawPlaceholder(paddingTop, group, comboOriginPoint);
    self.drawTitle(cfg, group, comboOriginPoint);
    self.drawDesc(cfg, group, comboOriginPoint);

    return rect;
  },

  drawPlaceholder(paddingTop: number,group: GGroup, originPoint: OriginPoint) {
    const { x, y } = originPoint;
    group.addShape("rect", {
      attrs: {
        x,
        y,
        width: COMMON_FIELD_WIDTH,
        height: paddingTop,
        fill: "transparent",
        radius: [8, 8, 0, 0],
        cursor: "move",
      },
    });
  },

  drawTitle(cfg: NodeModel, group: GGroup, originPoint: OriginPoint) {
    const self = this;
    const style = self.getShapeStyle(cfg);
    const { data } = cfg;
    const { title } = data as ComboAttr;
    const { x, y } = originPoint;
    group.addShape("rect", {
      name: "combo-title-bg",
      className: TITLE_SHAPE,
      draggable: true,
      attrs: {
        x: x + COMBO_BORDER,
        y: y + COMBO_BORDER,
        width: style.width - COMBO_BORDER * 2,
        // width: COMMON_FIELD_WIDTH - COMBO_BORDER,
        height: COMBO_TITLE_HEIGHT,
        fill: "#999",
        radius: [8, 8, 0, 0],
        cursor: "move",
      },
    });
    group.addShape("rect", {
      name: "combo-title-shape",
      className: TITLE_SHAPE,
      draggable: true,
      attrs: {
        x: x + COMBO_BORDER / 2,
        y: y + COMBO_BORDER,
        width: style.width - COMBO_BORDER,
        // width: COMMON_FIELD_WIDTH - COMBO_BORDER,
        height: COMBO_TITLE_HEIGHT - COMNO_FIELD_GAP_HEIGHT,
        fill: "#FFF",
        radius: [8, 8, 0, 0],
        cursor: "move",
      },
    });
    group.addShape("text", {
      name: "combo-title",
      className: TITLE_SHAPE,
      draggable: true,
      attrs: {
        x: x + 10,
        y: y + COMBO_TITLE_HEIGHT / 2,
        text: title,
        ...titleStyle,
        cursor: "move",
      },
    });
  },

  drawDesc(cfg: NodeModel, group: GGroup, originPoint: OriginPoint) {
    const self = this;
    const style = self.getShapeStyle(cfg);
    const { data } = cfg;
    const { desc } = data as ComboAttr;
    const { x, y } = originPoint;
    group.addShape("rect", {
      name: "combo-desc-bg",
      className: DESC_SHAPE,
      draggable: true,
      attrs: {
        x: x + COMBO_BORDER,
        y: y + COMBO_TITLE_HEIGHT + COMBO_BORDER,
        width: style.width - COMBO_BORDER * 2,
        // width: COMMON_FIELD_WIDTH - COMBO_BORDER,
        height: COMBO_DESC_HEIGHT,
        fill: "#999",
        cursor: "move",
      },
    });
    group.addShape("rect", {
      name: "combo-desc-shape",
      className: DESC_SHAPE,
      draggable: true,
      attrs: {
        x: x + COMBO_BORDER / 2,
        y: y + COMBO_TITLE_HEIGHT + COMBO_BORDER,
        width: style.width - COMBO_BORDER,
        // width: COMMON_FIELD_WIDTH- COMBO_BORDER,
        height: COMBO_DESC_HEIGHT - COMNO_FIELD_GAP_HEIGHT,
        fill: "#FFF",
        cursor: "move",
      },
    });
    group.addShape("text", {
      className: DESC_SHAPE,
      name: "combo-desc",
      draggable: true,
      attrs: {
        x: x + 10,
        y: y + COMBO_TITLE_HEIGHT + COMBO_DESC_HEIGHT / 2,
        text: desc,
        ...titleStyle,
        cursor: "move",
      },
    });
  },

  afterUpdate(cfg, combo) {
    const self = this;
    const group = combo.get("group");
    // this.onAfterUpdate(self, cfg, group);

    // this.updateComboStyle(cfg, group);
    console.log("afterUpdate>>>>>>");
    this.updateTitlePosition(self, cfg, group);
    this.updateDescPosition(self, cfg, group);
  },

  updateComboStyle(cfg, group) {
    const item = group.find((item) => {
      return item.get("name") === "combo-keyShape";
    });
    console.log("object>>>>", cfg.children);
    const childrenLen = cfg.children ? cfg.children.length : 0;
    const padding = cfg.padding;
    item.attr({
      width: COMMON_FIELD_WIDTH,
      height:
        padding[0] +
        COMNO_FIELD_GAP_HEIGHT * 2 +
        childrenLen * COMMON_FIELD_HEIGHT,
    });
  },

  updateTitlePosition(self, cfg, group) {
    const comboOriginPoint = getComboOriginPoint(self, cfg);
    const { x, y } = comboOriginPoint;
    const item1 = group.find((item) => {
      return item.get("name") === "combo-title-bg";
    });
    item1.attr({
      x: x + COMBO_BORDER,
      y: y + COMBO_BORDER,
    });
    const item2 = group.find((item) => {
      return item.get("name") === "combo-title-shape";
    });
    item2.attr({
      x: x + COMBO_BORDER / 2,
      y: y + COMBO_BORDER,
    });
    const item3 = group.find((item) => {
      return item.get("name") === "combo-title";
    });
    item3.attr({
      x: x + 10,
      y: y + COMBO_TITLE_HEIGHT / 2,
    });
  },

  updateDescPosition(self, cfg, group) {
    const comboOriginPoint = getComboOriginPoint(self, cfg);
    const { x, y } = comboOriginPoint;
    const item1 = group.find((item) => {
      return item.get("name") === "combo-desc-bg";
    });
    item1.attr({
      x: x + COMBO_BORDER,
      y: y + COMBO_TITLE_HEIGHT + COMBO_BORDER,
    });
    const item2 = group.find((item) => {
      return item.get("name") === "combo-desc-shape";
    });
    item2.attr({
      x: x + COMBO_BORDER / 2,
      y: y + COMBO_TITLE_HEIGHT + COMBO_BORDER,
    });
    const item3 = group.find((item) => {
      return item.get("name") === "combo-desc";
    });
    item3.attr({
      x: x + 10,
      y: y + COMBO_TITLE_HEIGHT + COMBO_DESC_HEIGHT / 2,
    });
  },

  // onAfterUpdate: debounce((self, cfg, group) {
  //   // const group = combo.get("group");
  //   const comboOriginPoint = getComboOriginPoint(self, cfg);

  //   const children = group.findAll((item) => {
  //     return (
  //       item.get("className") === TITLE_SHAPE ||
  //       item.get("className") === DESC_SHAPE
  //     );
  //   });

  //   if (children) {
  //     map(children, (child) => {
  //       group.removeChild(child);
  //     });
  //   }

  //   self.drawTitle(cfg, group, comboOriginPoint);
  //   self.drawDesc(cfg, group, comboOriginPoint);
  // }, 500),

  setState(name: string, value: string | boolean, item: Item) {
    setAnchorPointsState.call(this, name, value, item);
  },

  getAnchorPoints() {
    return [
      [0, 0.5],
      [1, 0.5],
    ];
  },
};
G6.registerCombo("combo-rect", comboRect, "rect");

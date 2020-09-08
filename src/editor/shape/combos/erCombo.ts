import { merge } from "lodash";
import G6 from "@antv/g6";
import { ShapeOptions as IShapeOptions } from "@antv/g6/lib/interface/shape";
import { GGroup, NodeModel, Item } from "@/common/interfaces";
import { ItemState } from "@/common/constants";
import { getComboOriginPoint } from "@/shape/utils";
import { setAnchorPointsState } from "../common/anchor";
import {
  COMBO_BORDER,
  COMBO_TITLE_HEIGHT,
  COMBO_DESC_HEIGHT,
  NODE_FONT_SIZE,
  COMNO_FIELD_GAP_HEIGHT,
} from "../constants";

const titleStyle = {
  fill: "#000000",
  textBaseline: "middle",
  fontSize: NODE_FONT_SIZE,
};

const WRAPPER_CLASS_NAME = "combo-wrapper";
const TITLE_SHAPE = "title-shape";
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
  options: {
    wrapperStyle: {
      shadowColor: 'transparent',
      shadowBlur: 0,
    },
    stateStyles: {
      [ItemState.Active]: {
        wrapperStyle: {
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 10,
        },
      } as any,
      [ItemState.Selected]: {
        wrapperStyle: {
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 10,
        },
      } as any,
    },
  },

  getOptions(model: NodeModel) {
    return merge({}, this.options, model);
  },

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
    const style = self.getShapeStyle(cfg);
    const comboOriginPoint = getComboOriginPoint(self, cfg);
    const { x, y } = comboOriginPoint;
    const { wrapperStyle } = this.getOptions(cfg);
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
        fill: "#FFF",
        stroke: "#7947eb",
        lineWidth: COMBO_BORDER,
        radius: 8,
        cursor: "move",
        ...wrapperStyle,
      },
    });

    self.drawTitle(cfg, group, comboOriginPoint);
    self.drawDesc(cfg, group, comboOriginPoint);

    return rect;
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

    this.updateTitlePosition(self, cfg, group);
    this.updateDescPosition(self, cfg, group);
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

  setState(name: string, value: string | boolean, item: Item) {
    const group = item.get("group");
    const model = item.getModel();
    const states = item.getStates() as ItemState[];

    const shape = group.find((item) => {
      return item.get("name") === "combo-keyShape";
    });

    const options = this.getOptions(model);
    const shapeNameStyle = "wrapperStyle";

    shape.attr({ ...options[shapeNameStyle] });

    states.forEach((state) => {
      if (
        options.stateStyles[state] &&
        options.stateStyles[state][shapeNameStyle]
      ) {
        shape.attr({
          ...options.stateStyles[state][shapeNameStyle],
        });
      }
    });
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

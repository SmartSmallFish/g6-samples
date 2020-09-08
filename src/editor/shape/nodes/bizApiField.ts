import G6 from "@antv/g6";
import merge from "lodash/merge";
import isArray from "lodash/isArray";
import { ItemState } from "@/common/constants";
import { GGroup, NodeModel, CustomNode, Item } from "@/common/interfaces";
import { setAnchorPointsState } from "@/shape/common/anchor";
import { getLetterWidth } from "@/utils";
import { optimizeMultilineText } from "../utils";
import {
  COMMON_FIELD_WIDTH,
  COMMON_FIELD_HEIGHT,
  NODE_FONT_SIZE,
} from "../constants";

const WRAPPER_HORIZONTAL_PADDING = 10;

const WRAPPER_CLASS_NAME = "field-wrapper";
const CONTENT_CLASS_NAME = "field-content";
const FIELD_LABEL_CLASS_NAME = "field-label";
const FIELD_VALUE_CLASS_NAME = "field-value";

interface ComboField {
  label: string;
  value: string;
}

const bizApiField: CustomNode = {
  options: {
    size: [COMMON_FIELD_WIDTH, COMMON_FIELD_HEIGHT],
    wrapperStyle: {
      fill: "transparent",
    },
    contentStyle: {
      fill: "transparent",
    },
    labelStyle: {
      fill: "#000000",
      textBaseline: "middle",
      fontSize: NODE_FONT_SIZE,
    },
    stateStyles: {
      [ItemState.Active]: {
        wrapperStyle: {
          fill: "#fafafa",
        },
        contentStyle: {
          fill: "#fafafa",
        },
        labelStyle: {},
      } as any,
      [ItemState.Selected]: {
        wrapperStyle: {
        },
        contentStyle: {},
        labelStyle: {},
      } as any,
    },
  },

  getOptions(model: NodeModel) {
    return merge({}, this.options, this.getCustomConfig(model) || {}, model);
  },

  draw(model, group) {
    const keyShape = this.drawWrapper(model, group);

    this.drawContent(model, group);
    this.drawLabel(model, group);

    return keyShape;
  },

  drawWrapper(model: NodeModel, group: GGroup) {
    const [width, height] = this.getSize(model);
    const { wrapperStyle } = this.getOptions(model);

    const shape = group.addShape("rect", {
      className: WRAPPER_CLASS_NAME,
      draggable: true,
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        radius: 3,
        ...wrapperStyle,
      },
    });

    return shape;
  },

  drawContent(model: NodeModel, group: GGroup) {
    const [width, height] = this.getSize(model);
    const { contentStyle } = this.getOptions(model);

    group.addShape("rect", {
      className: CONTENT_CLASS_NAME,
      draggable: true,
      attrs: {
        x: 0,
        y: 0,
        width: width / 2,
        height,
        ...contentStyle,
        // fill: "#FF0",
      },
    });

    group.addShape("rect", {
      className: CONTENT_CLASS_NAME,
      draggable: true,
      attrs: {
        x: width / 2,
        y: 0,
        width: width / 2,
        height,
        ...contentStyle,
      },
    });
  },

  drawLabel(model: NodeModel, group: GGroup) {
    const [width, height] = this.getSize(model);
    const { labelStyle } = this.getOptions(model);
    const { data } = model;
    const { label, value } = data as ComboField;

    group.addShape("text", {
      className: FIELD_LABEL_CLASS_NAME,
      draggable: true,
      attrs: {
        x: WRAPPER_HORIZONTAL_PADDING,
        y: height / 2,
        text: label,
        ...labelStyle,
      },
    });

    const shape = group.addShape("text", {
      className: FIELD_VALUE_CLASS_NAME,
      draggable: true,
      attrs: {
        x: width / 2,
        y: height / 2,
        text: value,
        ...labelStyle,
      },
    });
    return shape;
  },

  update(model, item) {
    const group = item.getContainer();
    const labelShape = group.findByClassName(FIELD_LABEL_CLASS_NAME);
    if (labelShape) {
      group.removeChild(labelShape);
    }
    const valueShape = group.findByClassName(FIELD_VALUE_CLASS_NAME);
    if (valueShape) {
      group.removeChild(valueShape);
    }

    this.drawLabel(model, group);
  },

  setState(name, value, item) {
    const group = item.getContainer();
    const model = item.getModel();
    const states = item.getStates() as ItemState[];

    [
      WRAPPER_CLASS_NAME,
      CONTENT_CLASS_NAME,
      FIELD_LABEL_CLASS_NAME,
      FIELD_VALUE_CLASS_NAME,
    ].forEach((className) => {
      const shape = group.findByClassName(className);
      const options = this.getOptions(model);

      const shapeName = className.split("-")[1];

      shape.attr({
        ...options[`${shapeName}Style`],
      });

      states.forEach((state) => {
        if (
          options.stateStyles[state] &&
          options.stateStyles[state][`${shapeName}Style`]
        ) {
          shape.attr({
            ...options.stateStyles[state][`${shapeName}Style`],
          });
        }
      });
    });

    if (name === ItemState.Selected) {
      const wrapperShape = group.findByClassName(WRAPPER_CLASS_NAME);

      const [width, height] = this.getSize(model);

      wrapperShape.attr({
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    if (this.afterSetState) {
      this.afterSetState(name, value, item);
    }
  },

  getSize(model: NodeModel) {
    const { size } = this.getOptions(model);

    if (!isArray(size)) {
      return [size, size];
    }

    return size;
  },

  getCustomConfig() {
    return {};
  },

  afterSetState(name: string, value: string | boolean, item: Item) {
    setAnchorPointsState.call(this, name, value, item);
  },

  getAnchorPoints() {
    return [
      // [0.5, 0],
      // [0.5, 1],
      [0, 0.5],
      [1, 0.5],
    ];
  },
};

G6.registerNode("bizApiField", bizApiField);

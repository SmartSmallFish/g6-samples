import G6 from "@antv/g6";
import { ShapeOptions as IShapeOptions } from "@antv/g6/lib/interface/shape";
import {
  IPoint,
  ShapeStyle as IShapeStyle,
  GraphOptions as IGraphOptions,
  GraphData as IGraphData,
  TreeGraphData as ITreeGraphData,
  NodeConfig as INodeConfig,
  EdgeConfig as IEdgeConfig,
  BehaviorOption as IBehaviorOption,
  IG6GraphEvent as IGraphEvent,
} from "@antv/g6/lib/types";
import IGroup from "@antv/g-canvas/lib/group";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 300;

const TITLE_HEIGHT = 35;

const bizErNode: IShapeOptions = {
  /**
   * 绘制节点，包含文本
   * @param  {Object} cfg 节点的配置项
   * @param  {G.Group} group 图形分组，节点中的图形对象的容器
   * @return {G.Shape} 绘制的图形，通过 node.get('keyShape') 可以获取到
   */
  draw(cfg: INodeConfig, group: IGroup) {
    const shape = this.drawWrapper(cfg, group);

    this.darwTitle(cfg, group);
    this.darwField(cfg, group);

    return shape;
  },

  drawWrapper(cfg: INodeConfig, group: IGroup) {
    const { x, y } = cfg;
    const shape = group.addShape("rect", {
      name: "er-shape",
      draggable: true,
      attrs: {
        x,
        y,
        // size: [150, 150],
        fill: "red",
        stroke: "red",
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      },
    });

    return shape;
  },

  darwTitle(cfg: INodeConfig, group: IGroup) {
    const { x, y } = cfg;
    const shape = group.addShape("rect", {
      draggable: true,
      attrs: {
        x,
        y,
        width: NODE_WIDTH,
        height: TITLE_HEIGHT,
        fill: "#FF0",
      },
    });

    return shape;
  },

  darwField(cfg: INodeConfig, group: IGroup) {
    const { x, y } = cfg;
    const shape = group.addShape("rect", {
      draggable: true,
      attrs: {
        x,
        y: y + TITLE_HEIGHT,
        width: NODE_WIDTH,
        height: TITLE_HEIGHT,
        fill: "#000",
      },
    });

    return shape;
  },
  // drawLabel(cfg: INodeConfig, group: IGroup) {},
  /**
   * 绘制后的附加操作，默认没有任何操作
   * @param  {Object} cfg 节点的配置项
   * @param  {G.Group} group 图形分组，节点中的图形对象的容器
   */
  afterDraw(cfg: INodeConfig, group: IGroup) {},
  /**
   * 更新节点，包含文本
   * @override
   * @param  {Object} cfg 节点的配置项
   * @param  {Node} node 节点
   */
  update(cfg, node) {},
  /**
   * 更新节点后的操作，一般同 afterDraw 配合使用
   * @override
   * @param  {Object} cfg 节点的配置项
   * @param  {Node} node 节点
   */
  afterUpdate(cfg, node) {},
  /**
   * 设置节点的状态，主要是交互状态，业务状态请在 draw 方法中实现
   * 单图形的节点仅考虑 selected、active 状态，有其他状态需求的用户自己复写这个方法
   * @param  {String} name 状态名称
   * @param  {Object} value 状态值
   * @param  {Node} node 节点
   */
  setState(name, value, node) {},
  /**
   * 获取锚点（相关边的连入点）
   * @param  {Object} cfg 节点的配置项
   * @return {Array|null} 锚点（相关边的连入点）的数组,如果为 null，则没有锚点
   */
  getAnchorPoints(cfg) {
    return [
      [0.5, 1], // 底边中点
      [0.5, 0], // 上边中点
    ];
  },
};

G6.registerNode("bizErNode", bizErNode);

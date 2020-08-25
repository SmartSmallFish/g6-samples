import G6 from "@antv/g6";
import { ShapeOptions as IShapeOptions } from "@antv/g6/lib/interface/shape";
import { NodeConfig as INodeConfig } from "@antv/g6/lib/types";
import IGroup from "@antv/g-canvas/lib/group";
import { INode, IEdge } from "@antv/g6/lib/interface/item";

const options: IShapeOptions = {
  options: {
    style: {},
    stateStyles: {
      hover: {},
      selected: {},
    },
  },
  /**
   * 绘制节点/边，包含文本
   * @param  {Object} cfg 节点的配置项
   * @param  {G.Group} group 节点的容器
   * @return {G.Shape} 绘制的图形，通过node.get('keyShape') 可以获取到
   */
  draw(cfg: INodeConfig, group: IGroup) {},
  /**
   * 绘制后的附加操作，默认没有任何操作
   * @param  {Object} cfg 节点的配置项
   * @param  {G.Group} group 节点的容器
   */
  afterDraw(cfg: INodeConfig, group: IGroup) {},
  /**
   * 更新节点，包含文本
   * @override
   * @param  {Object} cfg 节点的配置项
   * @param  {Node} node 节点
   */
  update(cfg: INodeConfig, node: INode) {},
  /**
   * 更新节点后的操作，一般同 afterDraw 配合使用
   * @override
   * @param  {Object} cfg 节点的配置项
   * @param  {Node} node 节点
   */
  afterUpdate(cfg: INodeConfig, node: INode) {},
  /**
   * 设置节点的状态，主要是交互状态，业务状态请在 draw 方法中实现
   * 单图形的节点仅考虑 selected、active 状态，有其他状态需求的用户自己复写这个方法
   * @param  {String} name 状态名称
   * @param  {Object} value 状态值
   * @param  {Node} node 节点
   */
  setState(name: String, value: String, node: INode) {},
  /**
   * 获取控制点
   * @param  {Object} cfg 节点、边的配置项
   * @return {Array|null} 控制点的数组,如果为 null，则没有控制点
   */
  getAnchorPoints(cfg: INodeConfig) {
    return [];
  },
};

G6.registerNode("bizNode", options);

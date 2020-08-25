import G6 from "@antv/g6";
import { renderGroup } from "./util";

function renderByGroup({ width, height }) {
  const data = {
    nodes: [
      {
        id: "node1",
        type: "rect",
        x: 50,
        y: 50,
        data: [],
      },
      {
        id: "node2",
        type: "rect",
        x: 100,
        y: 50,
        data: [],
      },
    ],
  };

  // 创建 G6 图实例
  const graph = new G6.Graph({
    container: "container",
    // 画布宽高
    width,
    height,
    modes: {
      // 支持的 behavior
      default: [
        // "drag-canvas",
        // "zoom-canvas",
        "drag-group",
        // "drag-node",
        // "collapse-expand-group",
        "drag-node-with-group",
      ],
    },
    fitCenter: true,
    // groupType: "rect",
    // groupStyle: {
    //   style: {
    //     default: {
    //       width: GROUP_WIDTH,
    //       height: FIELD_HEIGHT * 5,
    //     },
    //     hover: {},
    //     collapse: {},
    //   },
    // },
  });
  // 读取数据
  graph.data(data);
  // 渲染图
  graph.render();
  renderGroup(graph);
}

export default renderByGroup;

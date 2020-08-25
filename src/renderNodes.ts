import G6 from "@antv/g6";
import "./nodes/bizErNode";

function renderNodes({ width, height }) {
  const data = {
    nodes: [
      {
        id: "node1",
        type: "bizErNode",
        x: 50,
        y: 50,
        data: [],
      },
      {
        id: "node2",
        type: "bizErNode",
        x: 300,
        y: 50,
        data: [],
      },
    ],
    edges: [
      {
        id: "edge1",
        target: "node2",
        source: "node1",
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
      default: [
        "drag-canvas",
        "zoom-canvas",
        "drag-node",
        // "drag-group",
        // "collapse-expand-group",
        // "drag-node-with-group",
      ],
    },
    fitCenter: true,
  });
  // 读取数据
  graph.data(data);
  // 渲染图
  graph.render();
}

export default renderNodes;

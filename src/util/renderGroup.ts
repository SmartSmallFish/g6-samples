import { GROUP_WIDTH, FIELD_HEIGHT } from "../constants";
// import group from '../data/group.json'

const group = require('../data/group.json')

function renderGroup(graph) {
  const model = {
    groupId: "xxx000999",
    nodes: ["node1", "node2"],
    type: "rect",
    zIndex: 2,
    title: {
      text: "名称",
    },
  };

  graph.addItem("group", model);
}
export default renderGroup;
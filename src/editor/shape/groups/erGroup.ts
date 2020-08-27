import G6 from '@antv/g6';

G6.registerGroup("custom", {
  draw(item) {
    const group = item.getGraphicGroup();
    const childrenBox = item.getChildrenBBox();
    group.addShape("text", {
      attrs: {
        x: childrenBox.x,
        y: childrenBox.y,
        text: "这是一个群组",
        fill: "red",
      },
    });
    return group.addShape("rect", {
      attrs: {
        ...childrenBox,
        stroke: "red",
      },
    });
  },
});

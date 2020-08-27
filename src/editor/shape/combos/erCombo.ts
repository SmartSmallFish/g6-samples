import G6 from "@antv/g6";


G6.registerCombo(
  "cRect",
  {
    drawShape: function drawShape(cfg, group) {
      const self = this;
      // Get the padding from the configuration
      cfg.padding = cfg.padding || [50, 20, 20, 20];
      // Get the shape's style, where the style.width and style.height correspond to the width and height in the figure of Illustration of Built-in Rect Combo
      const style = self.getShapeStyle(cfg);
      // Add a rect shape as the keyShape which is the same as the extended rect Combo
      const rect = group.addShape("rect", {
        attrs: {
          ...style,
          x: -style.width / 2 - (cfg.padding[3] - cfg.padding[1]) / 2,
          y: -style.height / 2 - (cfg.padding[0] - cfg.padding[2]) / 2,
          width: style.width,
          height: style.height,
          // fill: "#bae637",
          stroke: "#7947eb",
          lineWidth: 3,
          radius: 8,
        },
        draggable: true,
        name: "combo-keyShape",
      });

      const { x, y, width, height } = rect.getBBox();

      const markerPosition = [
        { x: x + width / 2, y: y },
        { x: x, y: y + height / 2 },
        { x: x + width, y: y + height / 2 },
        { x: x + width / 2, y: y + height },
      ];

      markerPosition.forEach((item, index) => {
        group.addShape("marker", {
          attrs: {
            ...style,
            fill: "white",
            stroke: style.stroke,
            lineDash: [0, 0],
            opacity: 1,
            // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
            x: item.x,
            y: item.y,
            r: 5,
          },
          draggable: true,
          name: `combo-marker-shape-${index}`,
        });
      });
      return rect;
    },
    // Define the updating logic of the right circle
    afterUpdate: function afterUpdate(cfg, combo) {
      const group = combo.get("group");
      // Find the circle shape in the graphics group of the Combo by name
      const marker = group.find(
        (ele) => ele.get("name") === "combo-marker-shape"
      );
      // Update the position of the right circle
      marker.attr({
        // cfg.style.width and cfg.style.heigth correspond to the innerWidth and innerHeight in the figure of Illustration of Built-in Rect Combo
        x: cfg.style.width / 2 + cfg.padding[1],
        y: (cfg.padding[2] - cfg.padding[0]) / 2,
        // The property 'collapsed' in the combo data represents the collapsing state of the Combo
        // Update the symbol according to 'collapsed'
        // symbol: cfg.collapsed ? expandIcon : collapseIcon,
      });
    },
  },
  "rect"
);

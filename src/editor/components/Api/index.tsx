import React from "react";
import omit from "lodash/omit";
import merge from "lodash/merge";
import startsWith from "lodash/startsWith";
import G6 from "@antv/g6";
import { guid } from "@/utils";
import global from "@/common/global";
import { FLOW_CONTAINER_ID, GraphType } from "@/common/constants";
import {
  Graph,
  GraphOptions,
  GraphEvent,
  GraphReactEventProps,
} from "@/common/interfaces";
import { GraphData as IGraphData } from "@antv/g6/lib/types";
import behaviorManager from "@/common/behaviorManager";
import GraphComponent from "@/components/Graph";

import "./behavior";

interface ApiProps extends Partial<GraphReactEventProps> {
  style?: React.CSSProperties;
  className?: string;
  data: IGraphData;
  graphConfig?: Partial<GraphOptions>;
  customModes?: (mode: string, behaviors: any) => object;
}

interface ApiState {}

class Api extends React.Component<ApiProps, ApiState> {
  static defaultProps = {
    graphConfig: {},
  };

  graph: Graph | null = null;

  containerId = `${FLOW_CONTAINER_ID}_${guid()}`;

  canDragNode = (e: GraphEvent) => {
    const className = e.target.get("className");
    return (
      !["anchor", "banAnchor", "field-wrapper"].some(
        (item) => item === className
      ) && !startsWith(className, "field-")
    );
  };

  canDragOrZoomCanvas = () => {
    const { graph } = this;

    if (!graph) {
      return false;
    }

    return (
      global.plugin.itemPopover.state === "hide" &&
      global.plugin.contextMenu.state === "hide" &&
      global.plugin.editableLabel.state === "hide"
    );
  };

  parseData = (data) => {
    const { nodes, edges } = data;

    [...nodes, ...edges].forEach((item) => {
      const { id } = item;

      if (id) {
        return;
      }

      item.id = guid();
    });
  };

  initGraph = (width: number, height: number) => {
    const { containerId } = this;
    const { graphConfig, customModes } = this.props;

    const modes: any = merge(
      behaviorManager.getRegisteredBehaviors(GraphType.Flow),
      {
        default: {
          "drag-node": {
            type: "drag-node",
            enableDelegate: true,
            shouldBegin: this.canDragNode,
          },
          "drag-canvas": {
            type: "drag-canvas",
            shouldBegin: this.canDragOrZoomCanvas,
            shouldUpdate: this.canDragOrZoomCanvas,
          },
          "zoom-canvas": {
            type: "zoom-canvas",
            shouldUpdate: this.canDragOrZoomCanvas,
          },
          "recall-edge": "recall-edge",
          "brush-select": "brush-select",
          "drag-combo": "drag-combo",
        },
      }
    );

    Object.keys(modes).forEach((mode) => {
      const behaviors = modes[mode];

      modes[mode] = Object.values(
        customModes ? customModes(mode, behaviors) : behaviors
      );
    });

    this.graph = new G6.Graph({
      container: containerId,
      width,
      height,
      modes,
      defaultNode: {
        type: "bizApiNode",
      },
      defaultEdge: {
        type: "bizFlowEdge",
      },
      defaultCombo: {
        type: "combo-rect",
      },
      ...graphConfig,
      groupType: "rect",
    });

    return this.graph;
  };

  render() {
    const { containerId, parseData, initGraph } = this;

    return (
      <GraphComponent
        containerId={containerId}
        parseData={parseData}
        initGraph={initGraph}
        {...omit(this.props, ["graphConfig", "customModes"])}
      />
    );
  }
}

export default Api;

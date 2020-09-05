import React, { Fragment } from "react";
import { FormComponentProps } from "@ant-design/compatible/lib/form";
import { DetailPanel, withEditorContext } from "@/index";
import { EditorContextProps } from "@/components/EditorContext";
import { DetailPanelComponentProps } from "@/components/DetailPanel";
import ComboDetailForm from "./components/ComboDetailForm";

export interface PanelProps
  extends FormComponentProps,
    EditorContextProps,
    DetailPanelComponentProps {}

interface PanelState {}

class Panel extends React.Component<PanelProps, PanelState> {
  renderCanvasDetail = () => {
    return <p>Select a node or edge :)</p>;
  };

  renderMultiDetail = () => {
    return null;
  };

  renderComboDetail = () => {
    return <ComboDetailForm {...this.props} />;
  };

  renderNodeDetail = () => {
    const { nodes } = this.props;
    console.log("object>>>>", nodes);
    return null;
  };

  renderEdgeDetail = () => {
    const { edges } = this.props;
    console.log("object>>>>", edges);
    return null;
  };

  render() {
    const { type } = this.props;

    return (
      <Fragment>
        {type === "canvas" && this.renderCanvasDetail()}
        {type === "multi" && this.renderMultiDetail()}
        {type === "combo" && this.renderComboDetail()}
        {type === "node" && this.renderNodeDetail()}
        {type === "edge" && this.renderEdgeDetail()}
      </Fragment>
    );
  }
}

const WrappedPanel = withEditorContext(Panel);

export const NodePanel = DetailPanel.create<PanelProps>("node")(WrappedPanel);
export const EdgePanel = DetailPanel.create<PanelProps>("edge")(WrappedPanel);
export const MultiPanel = DetailPanel.create<PanelProps>("multi")(WrappedPanel);
export const CanvasPanel = DetailPanel.create<PanelProps>("canvas")(
  WrappedPanel
);
export const ComboPanel = DetailPanel.create<PanelProps>("combo")(WrappedPanel);

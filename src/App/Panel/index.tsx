import React from "react";
import upperFirst from "lodash/upperFirst";
import {
  Card,
  Input
} from "antd";
import { Form as LegacyForm } from "@ant-design/compatible";
import { FormComponentProps } from "@ant-design/compatible/lib/form";
import { DetailPanel, withEditorContext } from "@/index";
import { EditorContextProps } from "@/components/EditorContext";
import { DetailPanelComponentProps } from "@/components/DetailPanel";

const { Item } = LegacyForm;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

interface PanelProps
  extends FormComponentProps,
    EditorContextProps,
    DetailPanelComponentProps {}

interface PanelState {}

class Panel extends React.Component<PanelProps, PanelState> {
  handleSubmit = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      const { type, nodes, edges, executeCommand } = this.props;

      const item = type === "node" ? nodes[0] : edges[0];

      if (!item) {
        return;
      }

      executeCommand("update", {
        id: item.get("id"),
        updateModel: {
          ...values,
        },
      });
    });
  };

  renderNodeDetail = () => {
    const { form } = this.props;

    return (
      <LegacyForm>
        <Item label="Label" {...formItemLayout}>
          {form.getFieldDecorator("label", {
            initialValue: "",
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
      </LegacyForm>
    );
  };

  renderEdgeDetail = () => {
    const { form } = this.props;

    return (
      <LegacyForm>
        <Item label="Label" {...formItemLayout}>
          {form.getFieldDecorator("label", {
            initialValue: "",
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
      </LegacyForm>
    );
  };

  renderMultiDetail = () => {
    return null;
  };

  renderCanvasDetail = () => {
    const { form } = this.props;
    return <p>Select a node or edge :)</p>;
  };

  renderComboDetail = () => {
    return <p>this item is a combo</p>;
  };

  render() {
    const { type } = this.props;

    return (
      <Card title={upperFirst(type)} bordered={false}>
        {type === "node" && this.renderNodeDetail()}
        {type === "edge" && this.renderEdgeDetail()}
        {type === "multi" && this.renderMultiDetail()}
        {type === "canvas" && this.renderCanvasDetail()}
        {type === "combo" && this.renderComboDetail()}
      </Card>
    );
  }
}

const WrappedPanel = LegacyForm.create<PanelProps>({
  mapPropsToFields(props) {
    const { type, combos, nodes, edges } = props;
    console.log("object>>>>", type, combos);

    let label = "";

    if (type === "node") {
      label = nodes[0].getModel().label;
    }

    if (type === "edge") {
      label = edges[0].getModel().label;
    }

    return {
      label: LegacyForm.createFormField({
        value: label,
      }),
    };
  },
})(withEditorContext(Panel));

type WrappedPanelProps = Omit<PanelProps, keyof FormComponentProps>;


export const NodePanel = DetailPanel.create<WrappedPanelProps>("node")(
  WrappedPanel
);
export const EdgePanel = DetailPanel.create<WrappedPanelProps>("edge")(
  WrappedPanel
);
export const MultiPanel = DetailPanel.create<WrappedPanelProps>("multi")(
  WrappedPanel
);
export const CanvasPanel = DetailPanel.create<WrappedPanelProps>("canvas")(
  WrappedPanel
);
export const ComboPanel = DetailPanel.create<WrappedPanelProps>("combo")(
  WrappedPanel
);

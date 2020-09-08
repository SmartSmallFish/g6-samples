import React, { Component, createRef } from "react";
import { Form, Input, Button } from "antd";
import { PanelProps } from "../../Panel";
import { FormInstance } from "antd/lib/form";

export default class EdgeDetailForm extends Component<PanelProps> {
  formRef = createRef<FormInstance>();

  update = () => {
    const { edges, executeCommand } = this.props;

    const item = edges[0];

    if (!item) {
      return;
    }

    this.formRef.current.validateFields().then((values) => {
      executeCommand("update", {
        id: item.get("id"),
        updateModel: {
          ...values,
        },
      });
    });
  };

  render() {
    const { edges } = this.props;

    return (
      <Form
        ref={this.formRef}
        initialValues={{ label: edges[0].getModel().label }}
      >
        <Form.Item
          label="Label"
          name="label"
          rules={[{ required: true, message: "请输入Label" }]}
        >
          <Input />
        </Form.Item>
        <Button onClick={this.update}>保存</Button>
      </Form>
    );
  }
}

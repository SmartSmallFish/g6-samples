import React, { Component, Fragment } from "react";
import { Input, Button } from "antd";
import { map, forEach, findIndex, filter } from "lodash";
import { Form as LegacyForm } from "@ant-design/compatible";
import { INode, ICombo } from "@antv/g6/lib/interface/item";
import { NodeConfig, ComboConfig } from "@antv/g6/lib/types";
import { executeBatch, guid } from "@/utils";
import { COMMON_FIELD_HEIGHT } from "@/shape/constants";
import { PanelProps } from "../../Panel";
import FormField from "./FormField";

const { Item } = LegacyForm;

interface FormState {
  nodes: Array<NodeConfig>;
  comboData: ComboData;
}

interface ComboData {
  comboId: string;
  title: string;
  desc: string;
}

enum FIELD_STATUS {
  DELETED = "DELETED",
  ADD = "ADD",
}

class ComboDetailForm extends Component<PanelProps, FormState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.initState(props),
    };
  }

  firstFieldPos: { x: number; y: number } = null;

  getFirstFieldPos = (nodes: Array<NodeConfig>, combo: ICombo) => {
    if (nodes[0]) {
      const { x, y } = nodes[0];
      this.firstFieldPos = { x, y };
    } else {
    }
  };

  initState = (props): FormState => {
    const { combos } = props;
    const combo = combos[0];
    const nodes: INode[] = combo.getNodes();
    const comboConfig = combo.getModel() as ComboConfig;
    const { id: comboId } = comboConfig;
    const data = comboConfig.data as object;
    const childNodes: Array<NodeConfig> = [];
    forEach(nodes, (node) => {
      if (!node.destroyed) {
        childNodes.push(node.getModel() as NodeConfig);
      }
    });
    this.getFirstFieldPos(childNodes, combo);
    return {
      nodes: childNodes,
      comboData: { comboId, ...data } as ComboData,
    };
  };

  addField = () => {
    const {
      nodes,
      comboData: { comboId },
    } = this.state;
    const node = {
      comboId,
      id: guid(),
      depth: 1,
      type: "bizApiField",
      data: {},
      fieldStatus: FIELD_STATUS.ADD,
    } as NodeConfig;
    nodes.push(node);
    this.setState({ nodes });
  };

  delField = (node: NodeConfig) => {
    const { nodes } = this.state;
    const { fieldStatus } = node;
    const index = findIndex(nodes, (o) => {
      return o.id === node.id;
    });
    if (index !== -1) {
      if (fieldStatus === FIELD_STATUS.ADD) {
        nodes.splice(index, 1);
      } else {
        nodes[index].fieldStatus = FIELD_STATUS.DELETED;
      }
      this.setState({ nodes });
    }
  };

  saveCombo = () => {
    const { form, graph, combos } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log("constructor>>>>", COMMON_FIELD_HEIGHT);
      const { title, desc, ...rest } = values;

      const nodes = Object.values(rest);
      const delNodes = filter(nodes, (o) => {
        return o.fieldStatus === FIELD_STATUS.DELETED;
      });
      const comboNodes = filter(nodes, (o) => {
        return o.fieldStatus !== FIELD_STATUS.DELETED;
      });

      const { executeCommand } = this.props;
      executeBatch(graph, () => {
        map(delNodes, (node) => {
          combos[0].removeNode(node as INode);
          graph.removeItem(node.id);
        });
        map(comboNodes, (node, index) => {
          if (node.fieldStatus === FIELD_STATUS.ADD) {
            const model = {
              ...node,
              x: this.firstFieldPos.x,
              y: this.firstFieldPos.y + index * COMMON_FIELD_HEIGHT,
            };
            executeCommand("add", {
              id: node.id,
              model,
            });
          } else {
            executeCommand("update", {
              id: node.id,
              updateModel: {
                ...node,
                x: this.firstFieldPos.x,
                y: this.firstFieldPos.y + index * COMMON_FIELD_HEIGHT,
              },
            });
          }
        });
        combos[0].refresh();
        const {
          comboData: { comboId },
        } = this.state;
        graph.updateCombo(comboId);
        graph.refresh();
      });
    });
  };

  delCombo = () => {
    const {
      comboData: { comboId },
    } = this.state;
    const { graph } = this.props;
    graph.removeItem(comboId);
  };

  renderForm = () => {
    const { comboData, nodes } = this.state;
    const { form } = this.props;

    const visibleNodes = filter(nodes, (node) => {
      return node.fieldStatus !== FIELD_STATUS.DELETED;
    });

    const formItems = map(visibleNodes, (node: NodeConfig, index: number) => {
      const { id } = node;
      return (
        <Item key={`field_${id}`} label={`字段${index + 1}`}>
          {form.getFieldDecorator(`field_${id}`, {
            initialValue: node || {},
          })(<FormField onDel={this.delField} />)}
        </Item>
      );
    });

    const { title, desc } = comboData;

    return (
      <LegacyForm>
        <Item label="title">
          {form.getFieldDecorator("title", {
            initialValue: title || "",
          })(<Input />)}
        </Item>
        <Item label="desc">
          {form.getFieldDecorator("desc", {
            initialValue: desc || "",
          })(<Input />)}
        </Item>
        {formItems}
        <Button onClick={this.addField}>添加字段</Button>
        <Button onClick={this.saveCombo}>保存节点</Button>
        <Button onClick={this.delCombo}>删除节点</Button>
      </LegacyForm>
    );
  };

  render() {
    return <Fragment>{this.renderForm()}</Fragment>;
  }
}

export default LegacyForm.create()(ComboDetailForm);
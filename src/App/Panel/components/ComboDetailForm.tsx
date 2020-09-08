import React, { Component, Fragment } from "react";
import { Input, Button } from "antd";
import { map, forEach, findIndex, filter, isEqual } from "lodash";
import { Form as LegacyForm } from "@ant-design/compatible";
import { INode, ICombo } from "@antv/g6/lib/interface/item";
import { NodeConfig, ComboConfig } from "@antv/g6/lib/types";
import { executeBatch, guid } from "@/utils";
import { COMMON_FIELD_HEIGHT, COMMON_FIELD_WIDTH } from "@/shape/constants";
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

  getFirstFieldPos = (combo: ICombo) => {
    const { graph } = this.props;
    const BBox = combo.getBBox();
    const { centerX, centerY } = BBox;
    const { x: itemCenterX, y: itemCenterY } = graph.getCanvasByPoint(
      centerX,
      centerY
    );
    this.firstFieldPos = {
      x: itemCenterX - COMMON_FIELD_WIDTH / 2,
      y: itemCenterY,
    };
  };

  componentWillReceiveProps(nextProps) {
    const { combos } = this.props;
    if (!isEqual(combos, nextProps.combos)) {
      this.setState({
        ...this.initState(nextProps),
      });
    }
  }

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
    this.getFirstFieldPos(combo);
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
    const index = findIndex(nodes, (o) => {
      return o.id === node.id;
    });
    if (index !== -1) {
      nodes[index].fieldStatus = FIELD_STATUS.DELETED;
      this.setState({ nodes });
    }
  };

  saveCombo = () => {
    console.log(">>>>", COMMON_FIELD_HEIGHT);
    const { form, graph, combos } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
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
            const { fieldStatus, ...restOpts } = node as INode;
            const model = {
              ...restOpts,
              x: this.firstFieldPos.x,
              y: this.firstFieldPos.y + index * COMMON_FIELD_HEIGHT,
            };
            graph.add("node", model);

            // executeCommand("add", {
            //   id: node.id,
            //   model,
            // });
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
        graph.refreshPositions();
        graph.paint();
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

    let visibleNodeIndex = 0;

    const formItems = map(nodes, (node: NodeConfig, index: number) => {
      const { id } = node;
      const style =
        node.fieldStatus === FIELD_STATUS.DELETED ? { display: "none" } : {};
      if (node.fieldStatus !== FIELD_STATUS.DELETED) {
        ++visibleNodeIndex;
      }
      return (
        <Item
          key={`field_${id}`}
          label={`字段${visibleNodeIndex}`}
          style={style}
        >
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

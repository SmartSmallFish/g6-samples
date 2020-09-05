import React from 'react';
import { getSelectedNodes, getSelectedEdges, getSelectedCombos } from "@/utils";
import { GraphState, EditorEvent, ItemType } from '@/common/constants';
import { EditorContextProps, withEditorContext } from '@/components/EditorContext';
import { Combo, Node, Edge, GraphStateEvent } from "@/common/interfaces";

type DetailPanelType = 'node' | 'edge' | 'multi' | 'canvas' | 'combo';

export interface DetailPanelComponentProps {
  type: DetailPanelType;
  combos: Combo[];
  nodes: Node[];
  edges: Edge[];
}

class DetailPanel {
  static create = function<P extends DetailPanelComponentProps>(type: DetailPanelType) {
    return function(WrappedComponent: React.ComponentType<P>) {
      type TypedPanelProps = EditorContextProps & Omit<P, keyof DetailPanelComponentProps>;
      type TypedPanelState = { graphState: GraphState };

      class TypedPanel extends React.Component<TypedPanelProps, TypedPanelState> {
        state = {
          graphState: GraphState.CanvasSelected,
        };

        componentDidMount() {
          const { graph } = this.props;

          graph.on(EditorEvent.onGraphStateChange, ({ graphState }: GraphStateEvent) => {
            this.setState({
              graphState,
            });
          });
        }

        render() {
          const { graph } = this.props;
          const { graphState } = this.state;

          if (type === "canvas" || graphState !== `${type}Selected`) {
            return null;
          }

          const combos = getSelectedCombos(graph);
          
          const nodes = getSelectedNodes(graph);
          const edges = getSelectedEdges(graph);

          return (
            <WrappedComponent
              type={type}
              combos={combos}
              nodes={nodes}
              edges={edges}
              {...(this.props as any)}
            />
          );
        }
      }

      return withEditorContext<TypedPanelProps>(TypedPanel);
    };
  };
}

export default DetailPanel;

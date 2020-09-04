import {
  isMind,
  isEdge,
  getGraphState,
  clearSelectedState,
  isApiField,
} from "@/utils";
import { ItemState, GraphState, EditorEvent } from '@/common/constants';
import { Item, Behavior } from '@/common/interfaces';
import behaviorManager from '@/common/behaviorManager';
import { ComboConfig } from "@antv/g6/lib/types";

interface ClickItemBehavior extends Behavior {
  /** 处理点击事件 */
  handleItemClick({ item }: { item: Item }): void;
  /** 处理画布点击 */
  handleCanvasClick(): void;
  /** 处理按键按下 */
  handleKeyDown(e: KeyboardEvent): void;
  /** 处理按键抬起 */
  handleKeyUp(e: KeyboardEvent): void;
}

interface DefaultConfig {
  /** 是否支持多选 */
  multiple: boolean;
  /** 是否按下多选 */
  keydown: boolean;
  /** 多选按键码值 */
  keyCode: number;
}

const clickItemBehavior: ClickItemBehavior & ThisType<ClickItemBehavior & DefaultConfig> = {
  getDefaultCfg(): DefaultConfig {
    return {
      multiple: true,
      keydown: false,
      keyCode: 17,
    };
  },

  getEvents() {
    return {
      "combo:click": "handleItemClick",
      "node:click": "handleItemClick",
      "edge:click": "handleItemClick",
      "canvas:click": "handleCanvasClick",
      keydown: "handleKeyDown",
      keyup: "handleKeyUp",
    };
  },

  handleItemClick({ item: clickedItem }) {
    const { graph } = this;

    if ((isMind(graph) && isEdge(clickedItem))) {
      return;
    }

    // 通过combo内的节点找到外部的combo
    let item = clickedItem;
    if (isApiField(clickedItem)) {
      const itemModel = item.getModel() as ComboConfig;
      item = graph.findById(itemModel.comboId as string);
    }

    const isSelected = item.hasState(ItemState.Selected);

    if (this.multiple && this.keydown) {
      graph.setItemState(item, ItemState.Selected, !isSelected);
    } else {
      clearSelectedState(graph, selectedItem => {
        return selectedItem !== item;
      });

      if (!isSelected) {
        graph.setItemState(item, ItemState.Selected, true);
      }
    }

    const graphState = getGraphState(graph);
    graph.emit(EditorEvent.onGraphStateChange, {
      graphState,
    });
  },

  handleCanvasClick() {
    const { graph } = this;

    clearSelectedState(graph);

    graph.emit(EditorEvent.onGraphStateChange, {
      graphState: GraphState.CanvasSelected,
    });
  },

  handleKeyDown(e) {
    this.keydown = (e.keyCode || e.which) === this.keyCode;
  },

  handleKeyUp() {
    this.keydown = false;
  },
};

behaviorManager.register('click-item', clickItemBehavior);

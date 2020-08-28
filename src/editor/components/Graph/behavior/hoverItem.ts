import { ItemState } from '@/common/constants';
import { Item, Behavior } from '@/common/interfaces';
import behaviorManager from '@/common/behaviorManager';

interface HoverItemBehavior extends Behavior {
  /** 处理鼠标进入 */
  handleItemMouseenter({ item }: { item: Item }): void;
  /** 处理鼠标移出 */
  handleItemMouseleave({ item }: { item: Item }): void;
}

const hoverItemBehavior: HoverItemBehavior = {
  getEvents() {
    return {
      "combo:mouseenter": "handleItemMouseenter",
      "node:mouseenter": "handleItemMouseenter",
      "edge:mouseenter": "handleItemMouseenter",
      "combo:mouseleave": "handleItemMouseleave",
      "node:mouseleave": "handleItemMouseleave",
      "edge:mouseleave": "handleItemMouseleave",
    };
  },

  handleItemMouseenter({ item }) {
    const { graph } = this;

    graph.setItemState(item, ItemState.Active, true);
  },

  handleItemMouseleave({ item }) {
    const { graph } = this;

    graph.setItemState(item, ItemState.Active, false);
  },
};

behaviorManager.register('hover-item', hoverItemBehavior);

import React from "react";
import { hot } from "react-hot-loader/root";
// import G6 from "@antv/g6";
// import { GROUP_WIDTH, FIELD_HEIGHT } from "./constants";
import renderByGroup from "./renderByGroup";
import renderNodes from "./renderNodes";
import Editor, { Flow } from "./editor";

interface Props {
  name: string;
}

class App extends React.Component<Props> {
  componentDidMount() {
    const { clientWidth: width, clientHeight: height } = document.body;
    // renderByGroup({ width, height });
    renderNodes({ width, height });
  }

  render() {
    return <div id="container"></div>;
  }
}

export default hot(App);

import React from "react";
import { hot } from "react-hot-loader/root";
import "@/components/Graph/behavior/hoverItem";
import App from "./App";

interface Props {
  name: string;
}

class Main extends React.Component<Props> {
  componentDidMount() {}

  render() {
    return <App />;
  }
}

export default hot(Main);

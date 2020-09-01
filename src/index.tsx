import * as React from 'react';
import * as ReactDOM from "react-dom";

import Main from './Main';
import "./styles.css";
import "./styles.less";

var mountNode = document.getElementById("app");
ReactDOM.render(<Main name="Jane" />, mountNode);

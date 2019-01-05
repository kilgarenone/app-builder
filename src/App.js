import React, { Component } from "react";
import { initDraw } from "./draw";
import prepareContainerCreationProcess from "./container";
import { setGridBoxSize } from "./mouse";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { gridBoxSize: 0, activeElement: null };
    this.numberOfGridLines = 40;
  }

  componentDidMount() {
    const gridBoxSize = Math.round(
      (window.innerWidth - 200) / this.numberOfGridLines
    );
    this.setState({ gridBoxSize });
    prepareContainerCreationProcess(this.observeElement);
    setGridBoxSize(gridBoxSize);
  }

  observeElement = e => {
    console.log("observing element", e);
    this.activeElement = e;
  };

  mutateElementProperties = ({ prop, value }) => {
    this.activeElement.style[prop] = value;
  };

  render() {
    return (
      <>
        <div
          id="canvas"
          style={{
            display: "grid",
            maxHeight: "100vh",
            gridTemplate: `repeat(${this.numberOfGridLines}, ${
              this.state.gridBoxSize
            }px) / repeat(${this.numberOfGridLines}, ${
              this.state.gridBoxSize
            }px)`
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              pointerEvents: "none",
              backgroundSize: `${this.state.gridBoxSize}px ${
                this.state.gridBoxSize
              }px`,
              backgroundImage:
                "radial-gradient(circle at left top, #000000 1px, rgba(0, 0, 0, 0) 1px)"
            }}
          />
          {/* <div id="startPoint" /> */}
        </div>
        <div id="controller-sidebar">
          <div>hello world</div>
        </div>
      </>
    );
  }
}

export default App;

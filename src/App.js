import React, { Component } from "react";
import { initDraw } from "./draw";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { gridBoxSize: 0 };
    this.canvas = React.createRef();
    this.numberOfGridLines = 40;
  }
  componentDidMount() {
    const gridBoxSize = Math.round(window.innerWidth / this.numberOfGridLines);
    this.setState({ gridBoxSize });
    initDraw(this.canvas.current, gridBoxSize);
  }
  render() {
    return (
      <div
        id="canvas"
        style={{
          display: "grid",
          maxHeight: "100vh",
          gridTemplate: `repeat(${this.numberOfGridLines}, ${
            this.state.gridBoxSize
          }px) / repeat(${this.numberOfGridLines}, ${this.state.gridBoxSize}px)`
        }}
        ref={this.canvas}
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
        <div id="startPoint" />
      </div>
    );
  }
}

export default App;

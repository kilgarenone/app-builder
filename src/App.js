import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { initDraw } from "./draw";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { gridBoxSize: 0 };
    this.canvas = React.createRef();
  }
  componentDidMount() {
    const gridBoxSize = window.innerWidth / 40;
    this.setState({ gridBoxSize });
    initDraw(this.canvas.current, gridBoxSize);
  }
  render() {
    return (
      <div
        style={{
          display: "grid",
          maxHeight: "100vh",
          gridTemplate: `repeat(40, ${this.state.gridBoxSize}px) / repeat(40, ${
            this.state.gridBoxSize
          }px)`
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
            backgroundSize: `${this.state.gridBoxSize}px ${
              this.state.gridBoxSize
            }px`,
            backgroundImage:
              "radial-gradient(circle at left top, #000000 1px, rgba(0, 0, 0, 0) 1px)"
          }}
        />
        {/* <div style={{display: 'grid', gridTemplateColumns: }} */}
      </div>
    );
  }
}

export default App;

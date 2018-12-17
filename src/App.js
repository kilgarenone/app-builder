import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { initDraw } from "./draw";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { gridSize: 0 };
    this.canvas = React.createRef();
  }
  componentDidMount() {
    const gridSize = 1280 / 40;
    this.setState({ gridSize });
    initDraw(this.canvas.current);
  }
  render() {
    return (
      <div ref={this.canvas}>
        <div
          style={{
            height: "100vh",
            backgroundSize: `${this.state.gridSize}px ${this.state.gridSize}px`,
            backgroundImage:
              "radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px)"
          }}
        />
        {/* <div style={{display: 'grid', gridTemplateColumns: }} */}
      </div>
    );
  }
}

export default App;

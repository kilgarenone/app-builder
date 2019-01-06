import React, { Component } from "react";

export default class BorderRadius extends Component {
  // state = {val: 0};

  handleChange = e => {
    this.props.onPropChange({
      prop: "borderRadius",
      value: `${e.target.value}px`
    });
  };

  val = 0;

  changeValueWithMouseWheel = e => {
    const value = Math.sign(e.deltaY);

    this.props.onPropChange({
      prop: "borderRadius",
      value: `${(this.val += value)}px`
    });
    console.log("whell", Math.sign(e.deltaY));
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <label>
          Round corner
          <input
            type="text"
            onWheel={this.changeValueWithMouseWheel}
            onChange={this.handleChange}
          />
        </label>
      </div>
    );
  }
}

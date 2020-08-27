import React, { Component } from "react";

class Toast extends Component {
  render() {
    return <div id="snackbar">{this.props.message}</div>;
  }
}
export default Toast;

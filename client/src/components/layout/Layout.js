import React, { Component } from "react";

class Layout extends Component {
  render() {
    return (
      <div
        style={{
          background: "#f3f3f3",
          width: "100%",
          marginLeft: "31px",
          padding: "20px"
        }}
      >
        {this.props.name}
      </div>
    );
  }
}

export default Layout;

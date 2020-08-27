import React, { Component } from "react";
import Button from "../common/Button";
import Axios from "axios";
import Spinner from "../common/spinner";

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resendStatus: false
    };
    this.onResend = this.onResend.bind(this);
  }

  onResend() {
    this.setState({ resendStatus: true });
    Axios.post("/api/users/resendActivation/", { id: this.props.user.id })
      .then(data => {
        this.setState({ resendStatus: false });
      })
      .catch(e => {
        this.setState({ resendStatus: false });
      });
  }

  render() {
    return (
      <div
        className="Add Request"
        style={{ marginTop: "10px", background: "white", padding: "40px" }}
      >
        <h3 style={{ color: "#f95428" }}>
          Please Active your account. Activation mail is sent to your registered
          Email
        </h3>
        <div style={{ marginTop: "20px" }}>
          <Button style={{ width: "20%" }} onClick={() => this.onResend()}>
            {this.state.resendStatus ? <Spinner /> : "Resend Activation Link"}
          </Button>
        </div>
      </div>
    );
  }
}

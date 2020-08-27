import React, { Component } from "react";
import propTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Logout extends Component {
  componentDidMount = () => {
    this.props.logoutUser();
    this.props.history.push("/login");
  };

  render() {
    return <div />;
  }
}

Logout.propTypes = {
  auth: propTypes.object.isRequired,
  logoutUser: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Logout);

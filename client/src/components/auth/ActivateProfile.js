import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  checkProfileToken,
  hidePageLoading,
  showPageLoading
} from "../../actions/authActions";

import { Link } from "react-router-dom";
// import Spinner from "../common/spinner";

class ActivateProfile extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      pageLoading: false
    };
  }

  componentDidMount() {
    this.props.hidePageLoading();
    if (this.props.match.params.token) {
      this.props.checkProfileToken(this.props.match.params.token);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  componentWillUnmount = () => {
    this.props.showPageLoading();
  };

  render() {
    const { errors } = this.state;
    let message;
    if (errors.error) {
      message = <h3>{errors.error}</h3>;
    } else {
      message = (
        <div>
          <h3>profile successfully activated</h3>
          <Link to="/logout">Click here to Login</Link>
        </div>
      );
    }
    return (
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper auth-page">
          <div className="content-wrapper d-flex align-items-center auth auth-bg-4 theme-one">
            <div className="row w-100">
              <div className="col-lg-8 mx-auto">
                <div
                  className="auto-form-wrapper"
                  style={{
                    textAlign: "center",
                    color: "#f44336",
                    padding: "40px"
                  }}
                >
                  {message}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ActivateProfile.propTypes = {
  checkProfileToken: PropTypes.func.isRequired,
  showPageLoading: PropTypes.func.isRequired,
  hidePageLoading: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { checkProfileToken, showPageLoading, hidePageLoading }
)(ActivateProfile);

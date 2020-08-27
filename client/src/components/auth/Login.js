import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  loginUser,
  hidePageLoading,
  showPageLoading
} from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import { Link } from "react-router-dom";
import Spinner from "../common/spinner";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      pageLoading: false,
      loginLoading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount = () => {
    this.props.hidePageLoading();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.loading.login) {
      this.setState({
        loginLoading: true
      });
    } else {
      this.setState({
        loginLoading: false
      });
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  componentWillUnmount() {
    this.props.showPageLoading();
  }

  onSubmit(e) {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  }
  render() {
    const { errors, loginLoading } = this.state;

    return (
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper auth-page">
          <div className="content-wrapper d-flex align-items-center auth auth-bg-4 theme-one">
            <div className="row w-100">
              <div className="col-lg-4 mx-auto">
                <div className="auto-form-wrapper">
                  <div
                    style={{
                      textAlign: "center",
                      margin: "20px",
                      color: "#308ee0"
                    }}
                  >
                    <img
                      src="https://i.ibb.co/rfv5bFP/Da-3.png"
                      style={{ width: "60%" }}
                      alt="logo"
                    />
                  </div>
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      {/* <label className="label">Email</label> */}
                      <TextFieldGroup
                        placeholder="Email"
                        name="email"
                        onChange={this.onChange}
                        value={this.state.email}
                        error={errors.email}
                      />
                    </div>

                    <div className="form-group">
                      {/* <label className="label">Password</label> */}
                      <TextFieldGroup
                        placeholder="Password"
                        type="password"
                        name="password"
                        onChange={this.onChange}
                        value={this.state.password}
                        error={errors.password}
                      />
                    </div>

                    <div className="form-group">
                      <button className="btn btn-primary submit-btn btn-block">
                        {loginLoading === true ? <Spinner /> : "Login"}
                      </button>
                    </div>

                    <div className="form-group">
                      <Link
                        style={{ padding: "0" }}
                        className="btn btn-link"
                        to="ForgotPassword"
                      >
                        Forgot Password ?
                      </Link>

                      <Link
                        style={{
                          padding: "0",
                          marginLeft: "10px",
                          color: "#f44336"
                        }}
                        className="btn btn-link"
                        to="register"
                      >
                        Register
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  hidePageLoading: PropTypes.func.isRequired,
  showPageLoading: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { loginUser, hidePageLoading, showPageLoading }
)(Login);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  registerUser,
  hidePageLoading,
  showPageLoading
} from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import { Link } from "react-router-dom";
import Spinner from "../common/spinner";
import Toast from "../common/Toast";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      success: "",
      pageLoading: false,
      signupLoading: false,
      toast: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    this.props.hidePageLoading();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.loading.signup) {
      this.setState({
        signupLoading: true
      });
    } else {
      this.setState({
        signupLoading: false
      });
    }

    if (nextProps.auth.success !== "") {
      this.setState({
        success: nextProps.auth.success
      });
      if (this.state.toast) {
        this.toastFunction();
        this.setState({ toast: false });
        this.setState({
          signupLoading: false
        });
      }
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  componentWillUnmount() {
    this.props.showPageLoading();
  }

  toastFunction() {
    let x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function() {
      x.className = x.className.replace("show", "");
    }, 3000);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ toast: true });
    const userData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(userData, this.props.history);
  }
  render() {
    const { errors, signupLoading } = this.state;

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
                      {/* <label className="label">Name</label> */}
                      <TextFieldGroup
                        placeholder="Name"
                        name="name"
                        onChange={this.onChange}
                        value={this.state.name}
                        error={errors.name}
                      />
                    </div>

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
                      {/* <label className="label">Confirm Password</label> */}
                      <TextFieldGroup
                        placeholder="Confirm Password"
                        type="password"
                        name="password2"
                        onChange={this.onChange}
                        value={this.state.password2}
                        error={errors.password2}
                      />
                    </div>

                    <div className="form-group">
                      <button
                        className="btn btn-primary submit-btn btn-block"
                        style={{ height: "42px" }}
                      >
                        {signupLoading === true ? <Spinner /> : "Register"}
                      </button>
                    </div>

                    <div className="form-group">
                      <Link
                        style={{ padding: "0" }}
                        className="btn btn-link"
                        to="login"
                      >
                        click here for Login
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toast message={this.state.success} />
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
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
  { registerUser, hidePageLoading, showPageLoading }
)(Register);

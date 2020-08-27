import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Navbar from "../layout/NavBar";
import TextFieldGroup from "../common/TextFieldGroup";
import Spinner from "../common/spinner";
import { hidePageLoading, showPageLoading } from "../../actions/authActions";
import { getCurrentProfile, updateUser } from "../../actions/profileActions";
import moment from "moment";

class ProfileManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      contactNo: "",
      dateOfBirth: "",
      country: "",
      password: "",
      password2: "",
      user_status: "",
      profileLoading: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = () => {
    this.props.hidePageLoading();
    this.props.getCurrentProfile();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile !== null) {
      const { profile } = nextProps.profile;

      this.setState({ email: profile.email });
      this.setState({ name: profile.name });
      this.setState({ contactNo: profile.contactNo });
      this.setState({ dateOfBirth: profile.dateOfBirth });
      this.setState({ country: profile.country });
    }

    if (nextProps.loading.profile) {
      this.setState({ profileLoading: true });
    } else {
      this.setState({ profileLoading: false });
    }

    if (nextProps.auth) {
      this.setState({ user_status: nextProps.auth.user.status });
    }
  }

  componentWillUnmount = () => {
    this.props.showPageLoading();
  };

  onSubmit(e) {
    e.preventDefault();
    this.setState({ profileLoading: true });
    const userRequest = {
      email: this.state.email,
      name: this.state.name,
      contactNo: this.state.contactNo,
      dateOfBirth: this.state.dateOfBirth,
      country: this.state.country,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.updateUser(userRequest, this.props.history, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, user_status, profileLoading } = this.state;
    let html;
    if (user_status === "not_active") {
      html = (
        <div
          className="Add Request"
          style={{ marginTop: "10px", background: "white", padding: "40px" }}
        >
          <h3 style={{ color: "#f95428" }}>
            Please Active your account. Activation mail is sent to your
            registered Email
          </h3>
        </div>
      );
    } else {
      html = (
        <div
          className="Update Details"
          style={{ marginTop: "10px", background: "white" }}
        >
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Update Details</h4>

                <form onSubmit={this.onSubmit} className="form-sample">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group row">
                        <label className="col-sm-5 col-form-label">Email</label>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <TextFieldGroup
                            placeholder="Email"
                            name="email"
                            value={this.state.email}
                            onChange={this.onChange}
                            error={errors.email}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group row">
                        <label className="col-sm-5 col-form-label">Name</label>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <TextFieldGroup
                            placeholder="Name"
                            name="name"
                            value={this.state.name}
                            onChange={this.onChange}
                            error={errors.name}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group row">
                        <label className="col-sm-5 col-form-label">
                          Contact No
                        </label>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <TextFieldGroup
                            type="number"
                            placeholder="contact No"
                            name="contactNo"
                            value={this.state.contactNo}
                            onChange={this.onChange}
                            error={errors.contactNo}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group row">
                        <label className="col-sm-5 col-form-label">
                          Date of Birth
                        </label>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <TextFieldGroup
                            type="date"
                            placeholder="Date of Birth"
                            name="dateOfBirth"
                            value={moment(this.state.dateOfBirth).format(
                              "YYYY-MM-DD"
                            )}
                            onChange={this.onChange}
                            error={errors.dateOfBirth}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group row">
                        <label className="col-sm-5 col-form-label">
                          Country
                        </label>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <TextFieldGroup
                            placeholder="Country"
                            name="country"
                            value={this.state.country}
                            onChange={this.onChange}
                            error={errors.country}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group row">
                        <label className="col-sm-5 col-form-label">
                          Password
                        </label>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <TextFieldGroup
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.onChange}
                            error={errors.password}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group row">
                        <label className="col-sm-5 col-form-label">
                          Confirm Password
                        </label>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <TextFieldGroup
                            placeholder="Confirm Password"
                            type="password"
                            name="password2"
                            value={this.state.password2}
                            onChange={this.onChange}
                            error={errors.password2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <button className="btn btn-primary submit-btn btn-block">
                            {profileLoading === true ? (
                              <Spinner />
                            ) : (
                              "Update Details"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <Navbar layout={html} />;
  }
}

ProfileManage.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  hidePageLoading: PropTypes.func.isRequired,
  showPageLoading: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  loading: state.loading,
  request: state.request,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { hidePageLoading, showPageLoading, getCurrentProfile, updateUser }
)(withRouter(ProfileManage));

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addUser } from "../../actions/profileActions";
import Navbar from "../layout/NavBar";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

class AddAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      roleId: 1,
      password2: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const userData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      roleId: this.state.roleId
    };
    this.props.addUser(userData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    if (this.props.auth.user.roleId === 0) {
      this.props.history.push("/dashboard");
    }

    const options = {
      roleId: [{ label: "Admin", value: 1 }, { label: "User", value: 0 }]
    };

    const html = (
      <div
        className="Add Admin"
        style={{ marginTop: "10px", background: "white" }}
      >
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Add Admin</h4>
              <form onSubmit={this.onSubmit} className="form-sample">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label">* Name</label>
                      <div className="col-sm-9">
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
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label">* Email</label>
                      <div className="col-sm-9">
                        <TextFieldGroup
                          type="email"
                          placeholder="Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.onChange}
                          error={errors.email}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label">
                        * Password
                      </label>
                      <div className="col-sm-9">
                        <TextFieldGroup
                          type="password"
                          placeholder="Password"
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
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label">
                        * Confirm Password
                      </label>
                      <div className="col-sm-9">
                        <TextFieldGroup
                          type="password"
                          placeholder="Confirm Password"
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
                      <label className="col-sm-5 col-form-label">
                        User Type
                      </label>
                      <div className="col-sm-9">
                        <SelectListGroup
                          name="roleId"
                          value={this.state.roleId.toString()}
                          options={options.roleId}
                          error={errors.roleId}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <div className="col-sm-9">
                        <input
                          type="submit"
                          value="Submit"
                          className="btn btn-primary btn-fw"
                        />
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

    return <Navbar layout={html} />;
  }
}

AddAdmin.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addUser }
)(withRouter(AddAdmin));

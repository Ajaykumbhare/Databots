import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addRequest } from "../../actions/requestActions";
import Navbar from "../layout/NavBar";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { hidePageLoading, showPageLoading } from "../../actions/authActions";
import Resend from "../resend";
import Spinner from "../common/spinner";
class AddRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      added: false,
      user_status: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = () => {
    this.props.hidePageLoading();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.auth) {
      this.setState({ user_status: nextProps.auth.user.status });
    }

    if (!nextProps.loading.request) {
      this.setState({ title: "" });
      this.setState({ description: "" });
      this.setState({ added: true });
    } else {
      this.setState({ added: false });
    }
  }

  componentWillUnmount = () => {
    this.props.showPageLoading();
  };

  onSubmit(e) {
    e.preventDefault();
    const userRequest = {
      title: this.state.title,
      description: this.state.description
    };
    this.props.addRequest(userRequest, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, added, user_status } = this.state;

    let html;
    if (user_status === "not_active") {
      html = <Resend user={this.props.auth.user} />;
    } else {
      html = (
        <div
          className="Add Request"
          style={{ marginTop: "10px", background: "white" }}
        >
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Add Request</h4>

                <form onSubmit={this.onSubmit} className="form-sample">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group row">
                        <label className="col-sm-5 col-form-label">Title</label>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <TextFieldGroup
                            placeholder="Title"
                            name="title"
                            value={this.state.title}
                            onChange={this.onChange}
                            error={errors.title}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group row">
                        <label className="col-sm-5 col-form-label">
                          Description
                        </label>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <TextAreaFieldGroup
                            style={{ height: "100px" }}
                            placeholder="Description"
                            name="description"
                            value={this.state.description}
                            onChange={this.onChange}
                            error={errors.description}
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
                            {added === false ? <Spinner /> : "Add Request"}
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

AddRequest.propTypes = {
  addRequest: PropTypes.func.isRequired,
  hidePageLoading: PropTypes.func.isRequired,
  showPageLoading: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  loading: state.loading,
  request: state.request
});

export default connect(
  mapStateToProps,
  { addRequest, hidePageLoading, showPageLoading }
)(withRouter(AddRequest));

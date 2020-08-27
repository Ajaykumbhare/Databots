import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { getRequests } from "../../actions/requestActions";
import { hidePageLoading, showPageLoading } from "../../actions/authActions";
import Navbar from "../layout/NavBar";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import "react-table/react-table.css";
import Spinner from "../common/spinner";
import moment from "moment";
import Resend from "../resend";

class CheckRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      loading: true,
      user_status: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth) {
      this.setState({ user_status: nextProps.auth.user.status });
    }

    if (nextProps.request.requests !== null) {
      let requests = [];
      nextProps.request.requests.map(x =>
        requests.push({
          _id: x._id,
          title: x.title,
          created_on: moment(x.created_on).fromNow(),
          updated_on: moment(x.updated_on).fromNow(),
          status:
            x.status === 0
              ? "pending"
              : x.status === 1
              ? "Approved"
              : "Completed"
        })
      );
      this.setState({ requests });
      this.setState({ loading: nextProps.request.loading });
    }
  }

  componentDidMount = () => {
    this.props.hidePageLoading();
    this.props.getRequests();
  };

  componentWillUnmount = () => {
    this.props.showPageLoading();
  };

  render() {
    const { user_status } = this.state;

    let html;

    if (user_status === "not_active") {
      html = <Resend user={this.props.auth.user} />;
    } else {
      if (!this.state.loading) {
        let columns = [
          {
            Header: "Title",
            accessor: "title",
            Cell: ({ original }) => {
              return (
                <div>
                  <Link to={"checkRequest/" + original._id}>
                    {original.title}
                  </Link>
                </div>
              );
            },
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["title"] }),
            filterAll: true,
            headerClassName: "col-md-8 col-lg-8 col-sm-8 col-xs-8",
            className: "col-md-8 col-lg-8 col-sm-8 col-xs-8 text-justify ml-5"
          },
          {
            Header: "Created",
            accessor: "created_on",
            Cell: ({ original }) => {
              return <div>{original.created_on}</div>;
            },
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["created_on"] }),
            filterAll: true,
            headerClassName: "col-md-2 col-lg-2 col-sm-2 col-xs-2",
            className: "col-md-2 col-lg-2 col-sm-2 col-xs-2"
          },
          {
            Header: "Updated",
            accessor: "updated_on",
            Cell: ({ original }) => {
              return <div>{original.updated_on}</div>;
            },
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["updated_on"] }),
            filterAll: true,
            headerClassName: "col-md-2 col-lg-2 col-sm-2 col-xs-2",
            className: "col-md-2 col-lg-2 col-sm-2 col-xs-2"
          },
          {
            Header: "Status",
            accessor: "status",
            Cell: ({ original }) => {
              return <p>{original.status}</p>;
            },
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["status"] }),
            filterAll: true,
            headerClassName: "col-md-2 col-lg-2 col-sm-2 col-xs-2",
            className: "col-md-2 col-lg-2 col-sm-2 col-xs-2"
          }
        ];

        html = (
          <div className="Check Request">
            <ReactTable
              style={{
                textAlign: "center",
                background: "white",
                borderRadius: "3px",
                padding: "10px",
                boxShadow:
                  "0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12) !important"
              }}
              id="table"
              data={this.state.requests}
              columns={columns}
              defaultPageSize={10}
              filterable
              defaultFilterMethod={(filter, row) =>
                String(row[filter.id]) === filter.value
              }
              className="-striped -highlight"
            />
          </div>
        );
      } else {
        html = (
          <div className="Loading">
            <Spinner
              type="primary"
              style={{ width: "20px", height: "20px", fontSize: "10px" }}
            />
          </div>
        );
      }
    }

    return <Navbar layout={html} />;
  }
}

CheckRequest.propTypes = {
  auth: PropTypes.object.isRequired,
  getRequests: PropTypes.func.isRequired,
  hidePageLoading: PropTypes.func.isRequired,
  showPageLoading: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  request: state.request,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { getRequests, hidePageLoading, showPageLoading }
)(withRouter(CheckRequest));

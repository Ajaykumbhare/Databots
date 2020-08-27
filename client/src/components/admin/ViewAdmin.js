import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Navbar from "../layout/NavBar";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { displayAllUser, deleteUser } from "../../actions/profileActions";
import "./dataTable.css";
import matchSorter from "match-sorter";

class ViewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      loading: true
    };
    this.onChange = this.onChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
  }

  handleDelete(email) {
    this.props.deleteUser(email);
  }

  handleRestore(email) {
    this.props.deleteUser(email);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    const profile = nextProps.profile;
    this.setState({ profile: profile, loading: false });
  };

  componentDidMount = () => {
    this.props.displayAllUser();
  };

  render() {
    const data = [];

    if (!this.props.loading.profile && !this.state.loading) {
      this.state.profile.profile.map(x => {
        return data.push({
          name: x.name,
          email: x.email,
          roleId: x.roleId === 0 ? "User" : "Admin",
          status: x.status === 1 ? "active" : "not active"
        });
      });
    }

    const columns = [
      {
        Header: "Name",
        id: "name",
        className: "center",
        accessor: d => d.name,
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["name"] }),
        filterAll: true
      },
      {
        Header: "Email",
        id: "email",
        className: "center",
        accessor: d => d.email,
        Cell: row => (
          <div>
            <span title={row.value}>{row.value}</span>
          </div>
        ),
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["email"] }),
        filterAll: true
      },
      {
        Header: "Roll",
        id: "roleId",
        className: "center",
        accessor: d => d.roleId,
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["roleId"] }),
        filterAll: true
      },
      {
        Header: "Status",
        id: "status",
        className: "center",
        accessor: d => d.status,
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["status"] }),
        filterAll: true
      },
      {
        Header: "actions",
        className: "center",
        Cell: row => (
          <div>
            {row.original.status === "active" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => this.handleDelete(row.original.email)}
              >
                Delete
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.handleRestore(row.original.email)}
              >
                Restore
              </button>
            )}
          </div>
        ),
        filterable: false
      }
    ];

    const html = (
      <div className="Manage Users" style={{ marginTop: "10px" }}>
        <ReactTable
          style={{ background: "white" }}
          data={data}
          filterable
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );

    return <Navbar layout={html} />;
  }
}

ViewUser.propTypes = {
  displayAllUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { displayAllUser, deleteUser }
)(ViewUser);

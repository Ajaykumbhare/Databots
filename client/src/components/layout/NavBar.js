import React, { Component } from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import { connect } from "react-redux";
import $ from "jquery";
import Layout from "./Layout";
import AdminNav from "./AdminNav";
import {
  FaBars,
  FaChartLine,
  FaPlus,
  FaBriefcase,
  FaArrowRight,
  FaSearch,
  FaCartPlus
} from "react-icons/fa";

class Navbar extends Component {
  onShow(e) {
    e.preventDefault();
    $(".sidebar-offcanvas").toggleClass("active");
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    if (!isAuthenticated) {
      window.location.href = "/login";
    }
    return (
      <div className="container-scroller">
        <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
          <div
            className="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center"
            style={{ boxShadow: "rgba(50, 50, 50, 0.1) 0px 1px 7px" }}
          >
            <Link className="navbar-brand brand-logo" to="/dashboard">
              <img
                src="https://i.ibb.co/rfv5bFP/Da-3.png"
                style={{ width: "60%", height: "auto" }}
                alt="logo"
              />
            </Link>
            <Link className="navbar-brand brand-logo-mini" to="/Dashboard">
              <img
                src={
                  this.props.auth.admin
                    ? "https://img.icons8.com/dusk/64/000000/online-support.png"
                    : "https://img.icons8.com/dusk/64/000000/administrator-male.png"
                }
                alt="logo"
              />
            </Link>
          </div>
          <div className="navbar-menu-wrapper d-flex align-items-center">
            <ol className="breadcrumb" style={{ margin: 0 }}>
              <li
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "large",
                  fontFamily: "sans-serif"
                }}
                className="breadcrumb-item active"
                aria-current="page"
              >
                {this.props.layout.props.className}
              </li>
            </ol>
            <ul className="navbar-nav navbar-nav-right">
              <li className="nav-item dropdown d-none d-xl-inline-block">
                <Link
                  className="nav-link dropdown-toggle"
                  id="UserDropdown"
                  to="/dashboard"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    className="profile-text"
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "large",
                      fontFamily: "sans-serif"
                    }}
                  >
                    {user.name}
                  </span>
                  <img
                    className="img-xs rounded-circle"
                    src={
                      this.props.auth.admin
                        ? "https://img.icons8.com/dusk/64/000000/online-support.png"
                        : "https://img.icons8.com/dusk/64/000000/administrator-male.png"
                    }
                    alt="Profile"
                  />
                </Link>
                <div
                  className="dropdown-menu dropdown-menu-right navbar-dropdown"
                  aria-labelledby="UserDropdown"
                >
                  <Link to="/ProfileManage" className="dropdown-item mt-2">
                    Manage Accounts
                  </Link>
                  <Link to="/Logout" className="dropdown-item">
                    Log Out
                  </Link>
                </div>
              </li>
            </ul>
            <button
              className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
              onClick={this.onShow.bind(this)}
              type="button"
              data-toggle="offcanvas"
            >
              <FaBars />
            </button>
          </div>
        </nav>
        <div className="container-fluid page-body-wrapper">
          <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
              <li className="nav-item nav-profile">
                <div className="nav-link">
                  <div className="user-wrapper">
                    <div className="profile-image">
                      <img
                        src={
                          this.props.auth.admin
                            ? "https://img.icons8.com/dusk/64/000000/online-support.png"
                            : "https://img.icons8.com/dusk/64/000000/administrator-male.png"
                        }
                        alt="profile"
                      />
                    </div>
                    <div className="text-wrapper">
                      <p className="profile-name">{user.name}</p>
                      <div>
                        <small className="designation text-muted">
                          {user.roleId === 1 ? "Admin" : "User"}
                        </small>
                        <span className="status-indicator online" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  <FaChartLine>dashboard</FaChartLine>
                  <span style={{ marginLeft: "10px" }} className="menu-title">
                    Dashboard
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="collapse"
                  href="#ui-basic"
                  aria-expanded="false"
                  aria-controls="ui-basic"
                >
                  {/* <i className="menu-icon mdi mdi-content-copy"></i> */}
                  <FaBriefcase />
                  <span style={{ marginLeft: "10px" }} className="menu-title">
                    Works
                  </span>
                  <FaArrowRight style={{ marginLeft: "auto" }} />
                </a>
                <div className="collapse" id="ui-basic">
                  <ul className="nav flex-column sub-menu">
                    {user.roleId === 0 ? (
                      <li className="nav-item">
                        <Link className="nav-link" to="/addRequest">
                          <FaPlus />
                          <span
                            style={{ marginLeft: "5px" }}
                            className="menu-title"
                          >
                            Add Requests
                          </span>
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}

                    <li className="nav-item">
                      <Link className="nav-link" to="/checkRequest">
                        <FaSearch />
                        <span
                          style={{ marginLeft: "5px" }}
                          className="menu-title"
                        >
                          Check Requests
                        </span>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/checkOffers">
                        <FaCartPlus />
                        <span
                          style={{ marginLeft: "5px" }}
                          className="menu-title"
                        >
                          Check Offers
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              {user.roleId === 1 ? <AdminNav /> : ""}
            </ul>
          </nav>
          <Layout name={this.props.layout} style={this.props.style} />
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  auth: propTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Navbar);

import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Navbar from "../layout/NavBar";
import Spinner from "../common/spinner";
import { getDashboardCount } from "../../actions/requestActions";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pastOrder: 0,
      activeOrder: 0,
      totalRequest: 0,
      loading: true
    };
  }

  componentDidMount = () => {
    this.props.getDashboardCount();
  };

  componentWillReceiveProps = nextProps => {
    const { count } = nextProps.request;

    this.setState({
      pastOrder: count.past,
      totalRequest: count.total,
      activeOrder: count.active,
      loading: false
    });
  };

  render() {
    const { loading, pastOrder, activeOrder, totalRequest } = this.state;
    const html = (
      <div className="Dashboard" style={{ marginTop: "10px" }}>
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 grid-margin stretch-card">
            <div className="card card-statistics">
              <Link className="nav-link" to="/checkOffers">
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <img
                        src="https://img.icons8.com/nolan/64/000000/transaction-list.png"
                        alt="Requests"
                      />
                    </div>
                    <div className="float-right">
                      <p className="mb-0 text-right">Past Orders</p>
                      <div className="fluid-container">
                        <h3 className="font-weight-medium text-right mb-0">
                          {loading ? (
                            <Spinner
                              type="primary"
                              style={{
                                width: "20px",
                                height: "20px",
                                fontSize: "10px"
                              }}
                            />
                          ) : (
                            pastOrder
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <span>Number of Orders</span>
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 grid-margin stretch-card">
            <div className="card card-statistics">
              <Link className="nav-link" to="/checkOffers">
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <img
                        src="https://img.icons8.com/nolan/64/000000/invoice.png"
                        alt="active orders"
                      />
                    </div>
                    <div className="float-right">
                      <p className="mb-0 text-right">Active Orders</p>
                      <div className="fluid-container">
                        <h3 className="font-weight-medium text-right mb-0">
                          {loading ? (
                            <Spinner
                              type="primary"
                              style={{
                                width: "20px",
                                height: "20px",
                                fontSize: "10px"
                              }}
                            />
                          ) : (
                            activeOrder
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <span>Number of Active Orders</span>
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 grid-margin stretch-card">
            <div className="card card-statistics">
              <Link className="nav-link" to="/checkRequest">
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <img
                        src="https://img.icons8.com/nolan/64/000000/google-forms.png"
                        alt="total requests"
                      />
                    </div>
                    <div className="float-right">
                      <p className="mb-0 text-right">Total Requests</p>
                      <div className="fluid-container">
                        <h3 className="font-weight-medium text-right mb-0">
                          {loading ? (
                            <Spinner
                              type="primary"
                              style={{
                                width: "20px",
                                height: "20px",
                                fontSize: "10px"
                              }}
                            />
                          ) : (
                            totalRequest
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <span>Number of Requests</span>
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );

    return <Navbar layout={html} />;
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  request: state.request
});

export default connect(
  mapStateToProps,
  { getDashboardCount }
)(Dashboard);

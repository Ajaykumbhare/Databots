import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { getOffers } from "../../actions/requestActions";
import { checkOut } from "../../actions/checkOut";
import { hidePageLoading, showPageLoading } from "../../actions/authActions";
import Navbar from "../layout/NavBar";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import "react-table/react-table.css";
import Spinner from "../common/spinner";
import moment from "moment";
import Resend from "../resend";

class Offer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [],
      loading: true,
      user_status: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth) {
      this.setState({ user_status: nextProps.auth.user.status });
    }

    if (nextProps.offers.offers !== null) {
      let offers = [];
      nextProps.offers.offers.map(x =>
        offers.push({
          _id: x._id,
          title: x.title,
          updated_on: moment(x.updated_on).fromNow(),
          offerAmount: x.offerAmount,
          deliveryTime: x.deliveryTime,
          status:
            x.status === 0
              ? "pending"
              : x.status === 1
              ? "Approved"
              : "Completed"
        })
      );
      this.setState({ offers, loading: false });
    }
  }

  componentDidMount = () => {
    this.props.hidePageLoading();
    this.props.getOffers();
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
                <Link
                  className="text text-primary"
                  to={"checkOffers/" + original._id}
                  data-toggle="tooltip"
                  data-placement="top"
                  title={original.title}
                >
                  {original.title}
                </Link>
              );
            },
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["title"] }),
            filterAll: true,
            headerClassName: "col-md-4 col-lg-4 col-sm-4 col-xs-4",
            className: "col-md-4 col-lg-4 col-sm-4 col-xs-4 text-center"
          },
          {
            Header: "Amount",
            accessor: "offerAmount",
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["offerAmount"] }),
            filterAll: true,
            headerClassName: "col-md-2 col-lg-2 col-sm-2 col-xs-2",
            className: "col-md-2 col-lg-2 col-sm-2 col-xs-2 text-center"
          },
          {
            Header: "Delivery Time",
            accessor: "deliveryTime",
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ["deliveryTime"] }),
            filterAll: true,
            headerClassName: "col-md-2 col-lg-2 col-sm-2 col-xs-2",
            className: "col-md-2 col-lg-2 col-sm-2 col-xs-2 text-center"
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
          <div className="Check Offers">
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
              data={this.state.offers}
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

Offer.propTypes = {
  auth: PropTypes.object.isRequired,
  hidePageLoading: PropTypes.func.isRequired,
  showPageLoading: PropTypes.func.isRequired,
  getOffers: PropTypes.func.isRequired,
  checkOut: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  offers: state.offers,
  errors: state.errors,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { hidePageLoading, showPageLoading, getOffers, checkOut }
)(withRouter(Offer));

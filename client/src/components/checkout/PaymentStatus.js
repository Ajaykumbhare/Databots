import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { checkOutSuccess } from "../../actions/checkOut";

class PaymentStatus extends Component {
  componentDidMount = () => {
    if (this.props.location.pathname === "/success") {
      let payload = {
        url: `${this.props.location.pathname}${this.props.location.search}`,
        pathname: this.props.location.pathname,
        work_id: localStorage.getItem("_id"),
        amount: localStorage.getItem("offerAmount"),
        user_id: localStorage.getItem("uid"),
        delivery_on: localStorage.getItem("delivery_on")
      };
      this.props.checkOutSuccess(payload);
    }
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.checkOut.checkout_status !== null) {
      if (nextProps.checkOut.checkout_status.status === "Success") {
        const offerId = localStorage.getItem("_id");
        localStorage.removeItem("_id");
        localStorage.removeItem("offerAmount");
        localStorage.removeItem("uid");
        localStorage.removeItem("delivery_on");
        this.props.history.push("/checkOffers/" + offerId);
      }
    }
  };

  render() {
    return <div />;
  }
}

PaymentStatus.propTypes = {
  checkOutSuccess: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  checkOut: state.checkOut
});

export default connect(
  mapStateToProps,
  { checkOutSuccess }
)(PaymentStatus);

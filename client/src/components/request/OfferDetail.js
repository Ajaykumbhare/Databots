import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getOffer } from "../../actions/requestActions";
import { checkOut } from "../../actions/checkOut";
import { hidePageLoading, showPageLoading } from "../../actions/authActions";
import Navbar from "../layout/NavBar";
import styled from "styled-components";
import moment from "moment";
import Spinner from "../common/spinner";
import Button from "../common/Button";

const Wrapper = styled.div`
  display: grid;
  background: white;
  padding: 20px;
  box-shadow: 1px 1px 10px 0 rgba(0, 0, 0, 0.2);
  letter-spacing: normal;
`;

const Division = styled.div`
  :${props => props.position} {
    display: block;
    content: "";
    height: 5px;
    background: linear-gradient(
      to var(--direction, left),
      #03a9f4,
      transparent
    );
  }

  :after {
    --direction: right;
  }
  margin-top:20px;
  margin-bottom:20px;
`;

const Uname = styled.div`
  font-size: 12px;
  background-color: #ffc600;
  border-radius: 3px;
  padding: 1px 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
`;

const Content = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 10fr;
  padding: 10px;
  background: white;
`;

const Timestamp = styled.p`
  text-align: right;
  color: #03a9f4;
`;

const P = styled.pre`
  font-size: 15px;
  padding: 0;
  margin: 0;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
  word-break: break-all;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
`;

const Image = styled.img`
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.4);
  width: 75px;
  height: 75px;
  border-radius: 2px;
`;

const Cta = styled.div`
  display: grid;
  grid-gap: 10px;
`;

const Details = styled.div`
  display: grid;
  grid-template-columns: auto 10fr;
`;

class OfferDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offer: [],
      user: [],
      error: {},
      text: "",
      loading: true,
      spinner: false,
      checkoutURL: null
    };
  }

  componentDidMount = () => {
    this.props.hidePageLoading();
    this.props.getOffer(this.props.match.params.id);
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.offer.offers) {
      const { offers } = nextProps.offer;
      const { user } = this.props.auth;
      this.setState({ offer: offers, loading: false, user: user });
    }

    if (nextProps.checkout.url !== null) {
      this.setState({
        checkoutURL: nextProps.checkout.url.link
      });
    }
  };

  componentWillUnmount = () => {
    this.props.showPageLoading();
  };

  render() {
    const { offer, checkoutURL, user } = this.state;
    let offerThread = "";
    if (checkoutURL !== null) {
      localStorage.setItem("_id", offer[0]._id);
      localStorage.setItem("offerAmount", offer[0].offerAmount);
      localStorage.setItem("uid", user.id);
      localStorage.setItem(
        "delivery_on",
        moment()
          .add(offer[0].deliveryTime, "days")
          .format("LLL")
      );
      window.open(checkoutURL, "_self");
    }
    if (this.state.loading === false && this.state.offer.length > 0) {
      offerThread = (
        <Wrapper className="Details">
          <h3>{offer[0].title}</h3>
          <Division position="after" />
          <div className="checkout">
            <div>
              {offer[0].status === 1 ? (
                <div>
                  <img
                    src="https://img.icons8.com/office/32/000000/hourglass.png"
                    className="mr-2"
                    alt="hourglass"
                  />
                  <label
                    style={{
                      fontSize: "17px",
                      color: "#04a9f4",
                      fontFamily: "sans-serif"
                    }}
                  >
                    Order Started
                  </label>
                </div>
              ) : offer[0].status === 2 ? (
                <div>
                  <img
                    src="https://img.icons8.com/flat_round/32/000000/checkmark.png"
                    className="mr-2"
                    alt="checkmark"
                  />
                  <label
                    style={{
                      fontSize: "17px",
                      color: "#04a9f4",
                      fontFamily: "sans-serif"
                    }}
                  >
                    Order Completed
                  </label>
                </div>
              ) : user.roleId !== 1 ? (
                <Button
                  onClick={e => {
                    let payload = {
                      title: offer[0].title,
                      offerAmount: offer[0].offerAmount,
                      id: offer[0]._id
                    };
                    this.setState({
                      spinner: true
                    });
                    this.props.checkOut(payload);
                  }}
                  color="blue"
                  style={{ minWidth: "200px" }}
                >
                  {this.state.spinner === true ? (
                    <Spinner />
                  ) : (
                    "Pay Now using PayPal"
                  )}
                </Button>
              ) : (
                <div>
                  <img
                    src="https://img.icons8.com/office/32/000000/hourglass.png"
                    className="mr-2"
                    alt="hourglass"
                  />
                  <label
                    style={{
                      fontSize: "17px",
                      color: "#04a9f4",
                      fontFamily: "sans-serif"
                    }}
                  >
                    Order Pending
                  </label>
                </div>
              )}
            </div>
            <div>
              <Timestamp style={{ margin: 0 }}>
                Amount :{" "}
                <label className="text text-primary">
                  {offer[0].offerAmount} USD
                </label>
              </Timestamp>
              <Timestamp style={{ margin: 0 }}>
                Delivered on :{" "}
                <label className="text text-primary">
                  {offer[0].status === 0
                    ? moment()
                        .add(offer[0].deliveryTime, "days")
                        .format("LLL")
                    : moment(offer[0].delivery_on).format("LLL")}
                </label>
              </Timestamp>
            </div>
          </div>

          <Division position="before" />
          <Content>
            <div className="image">
              <Image
                src={
                  this.props.auth.admin
                    ? "https://img.icons8.com/dusk/64/000000/administrator-male.png"
                    : "https://img.icons8.com/dusk/64/000000/online-support.png"
                }
              />
            </div>
            <Cta>
              <Details>
                <Uname>
                  {this.props.auth.admin
                    ? offer[0].offerSentBy.name
                    : offer[0].offerSentBy.name}
                </Uname>
                <Timestamp>
                  {moment(offer[0].updated_on).format("LLL")}
                </Timestamp>
              </Details>
              <div className="thread">
                <P>{offer[0].description}</P>
              </div>
            </Cta>
          </Content>
        </Wrapper>
      );
    } else {
      offerThread = (
        <div className="Loading">
          <Spinner
            type="primary"
            style={{ width: "20px", height: "20px", fontSize: "10px" }}
          />
        </div>
      );
    }

    return <Navbar layout={offerThread} />;
  }
}

OfferDetail.propTypes = {
  auth: PropTypes.object.isRequired,
  hidePageLoading: PropTypes.func.isRequired,
  showPageLoading: PropTypes.func.isRequired,
  getOffer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  loading: state.loading,
  offer: state.offers,
  checkout: state.checkOut
});

export default connect(
  mapStateToProps,
  {
    hidePageLoading,
    showPageLoading,
    getOffer,
    checkOut
  }
)(withRouter(OfferDetail));

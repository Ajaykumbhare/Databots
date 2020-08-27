import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";
import GuestNavBar from "../layout/GuestNavBar";
import TextFieldGroup from "../common/TextFieldGroup";
import Button from "../common/Button";
import axios from "axios";
import * as R from "ramda";
import Promise from "bluebird";
import jsdom from "jsdom";
import Spinner from "../common/spinner";
const { JSDOM } = jsdom;

const Wrapper = styled.div`
  box-shadow: rgba(160, 160, 160, 0.1) 0px 3px 5px;
  padding: 100px !important;
  background-image: url("https://i.ibb.co/KG0V4rx/background-pattern.png"),
    linear-gradient(141deg, rgb(66, 165, 245) 0%, rgb(115, 133, 255) 100%);
  background-size: 70px auto;
  margin-top: 5%;

  @media (max-width: 768px) {
    padding: 50px !important;
    padding-top: 100px !important;
  }

  @media (max-width: 768px) {
    padding: 25px !important;
    padding-top: 100px !important;
  }
`;

const H2 = styled.h2`
  font-size: ${props => `${props.size}px`};
  line-height: 1.45;
  font-family: "Nunito", sans-serif;
  color: ${props => (props.color === "black" ? "black" : "white")};
  font-weight: bold;
  text-align: ${props => props.align};
  margin: 5px;
  @media (max-width: 768px) {
    font-size: ${props => `${Number(props.size) / 1.3}px`};
  }

  @media (max-width: 600px) {
    font-size: ${props => `${Number(props.size) / 1.5}px`};
  }
`;

const H3 = styled.h3`
  font-size: ${props => `${props.size}px`};
  line-height: 1.45;
  font-family: "Nunito", sans-serif;
  color: ${props => (props.color === "black" ? "black" : "white")};
  overflow-x: hidden;
  text-align: ${props => props.align};
  font-weight: bold;
  margin: 5px;
  @media (max-width: 768px) {
    font-size: ${props => `${Number(props.size) / 1.3}px`};
  }
  @media (max-width: 600px) {
    font-size: ${props => `${Number(props.size) / 1.5}px`};
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  @media (max-width: 768px) {
    display: block;
  }
`;

class YellowPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heading: "Scrape Data from YellowPages",
      keyword: "",
      location: "",
      business: [],
      phone: [],
      address: [],
      spinner: false,
      errors: {},
      download: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.download = this.download.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.location.trim() !== "" && this.state.keyword.trim() !== "") {
      this.setState({ spinner: true });
      try {
        return Promise.all(R.range(0, 1)).mapSeries(async x => {
          const { data } = await axios.get(
            `https://cors-anywhere.herokuapp.com/https://www.yellowpages.com/search?search_terms=${
              this.state.keyword
            }&geo_location_terms=${this.state.location}&page=${x + 1}`
          );
          const { document } = new JSDOM(data).window;
          let business_name = [];
          let phone = [];
          let address = [];

          if (document.querySelectorAll("a.business-name > span")) {
            business_name = Array.from(
              document.querySelectorAll("a.business-name > span")
            ).map(x => x.textContent.trim());
          }

          if (document.querySelector("div.phones.phone")) {
            phone = Array.from(
              document.querySelectorAll("div.phones.phone")
            ).map(x => x.textContent.trim());
          }

          if (document.querySelectorAll("p.adr")) {
            address = Array.from(document.querySelectorAll("p.adr")).map(x =>
              x.textContent.trim()
            );
          }
          this.setState({ spinner: false });
          this.setState({ business: business_name });
          this.setState({ phone: phone });
          this.setState({ address: address });
        });
      } catch (e) {
        this.setState({ spinner: false });
        console.log(e);
      }
    } else {
      if (this.state.keyword.trim() === "") {
        this.setState(prevState => ({
          errors: {
            ...prevState.errors,
            keyword: "Keyword is required"
          }
        }));
      } else {
        this.setState(prevState => ({
          errors: {
            ...prevState.errors,
            keyword: ""
          }
        }));
      }

      if (this.state.location.trim() === "") {
        this.setState(prevState => ({
          errors: {
            ...prevState.errors,
            location: "location is required"
          }
        }));
      } else {
        this.setState(prevState => ({
          errors: {
            ...prevState.errors,
            location: ""
          }
        }));
      }
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  download() {
    this.setState({ download: true });

    let jsonObject = {
      data: []
    };
    const businessName = Array.from(
      document.querySelectorAll("table > tbody > tr > td:nth-child(1)")
    ).map(x => x.innerText);

    let phoneNo = Array.from(
      document.querySelectorAll("table > tbody > tr > td:nth-child(2)")
    ).map(x => x.innerText);

    phoneNo.map((x, i) =>
      jsonObject.data.push({
        name: businessName[i],
        phone: phoneNo[i]
      })
    );

    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(jsonObject)], {
      type: "application/json"
    });
    element.href = URL.createObjectURL(file);
    element.download = this.state.keyword;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();

    setTimeout(() => {
      this.setState({ download: false });
    }, 100);
  }

  render() {
    const { errors, business, phone } = this.state;
    let table = [];
    if (business.length > 0) {
      table.push(
        <thead key="heading">
          <tr key="header">
            <th key="business_heading">Business Name</th>
            <th key="phone_heading">Phone</th>
          </tr>
        </thead>
      );

      business.map((x, i) =>
        table.push(
          <tbody key={i}>
            <tr key={i}>
              <td key={"business" + i}>{business[i]}</td>
              <td key={"phone" + i}>{phone[i]}</td>
            </tr>
          </tbody>
        )
      );
    }

    return (
      <div>
        <GuestNavBar />
        <Wrapper id="container" className="db-section p-sm-3">
          <Content className="container content">
            <section className="texts">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <Fade top>
                    <H2 size={"40"}>{this.state.heading}</H2>
                  </Fade>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <Fade top>
                    <H3 size={"25"}>
                      #1 World Website for Listing Local Business.
                      <br />
                      Grow your business with the Real Yellow Page Data.
                    </H3>
                  </Fade>
                </div>
              </div>
            </section>

            <section className="image">
              <div className="row mt-3">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <Zoom>
                    <img
                      src="http://i1.ypcdn.com/ypu/images/svgs/multi-device-dashboard.svg"
                      className="img-fluid"
                      alt="img_icon"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        margin: "10px"
                      }}
                    />
                  </Zoom>
                </div>
              </div>
            </section>
          </Content>
        </Wrapper>

        <div
          className="container"
          style={{
            boxShadow: "0 2px 5px 0 rgba(0,0,0,0.2)",
            marginBottom: "100px",
            marginTop: "60px",
            // paddingBottom: "40px",
            padding: "40px 40px 40px 40px"
          }}
        >
          <form
            className="align-items-center justify-content-center"
            onSubmit={this.onSubmit}
          >
            <div className="row">
              <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5 ">
                <label>Search Keyword</label>
                <TextFieldGroup
                  placeholder="Keyword"
                  name="keyword"
                  value={this.state.keyword}
                  onChange={this.onChange}
                  error={errors.keyword}
                />
              </div>

              <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5 ">
                <label>Search Location</label>
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                />
              </div>

              <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">
                <br />
                <Button color="purple">
                  {this.state.spinner ? <Spinner> </Spinner> : "Submit"}
                </Button>
              </div>
            </div>
          </form>
          <table className="table table-bordered table-responsive-sm">
            {table}
          </table>
          {table.length > 0 ? (
            <Button
              color="purple"
              style={{ marginTop: "12px" }}
              onClick={this.download}
            >
              {this.state.download ? <Spinner> </Spinner> : "Download"}
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

YellowPages.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(YellowPages);

import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";
import GuestNavBar from "./GuestNavBar";

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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heading: "Convert websites into useful data",
      description:
        " Our Data as a Service provides high-quality structured data to improve business outcomes and enable intelligent decision making."
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
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
                    <H3 size={"25"}>{this.state.description}</H3>
                  </Fade>
                </div>
              </div>
            </section>

            <section className="image">
              <div className="row mt-3">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <Zoom>
                    <img
                      src="https://i.ibb.co/1dmq0Y1/Unstructure-to-Structure-2.png"
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

        <div className="container mt-5">
          <div className="row mt-5">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-center">
              <Zoom>
                <img
                  src="https://i.ibb.co/qjwYctF/1.png"
                  className="img-fluid"
                  alt="img_icon"
                  style={{ maxWidth: "80%", height: "auto" }}
                />
              </Zoom>
              <Fade bottom>
                <H3 color="black" size="20" align="center">
                  Dynamic website scraping
                </H3>
                <H2
                  color="black"
                  size="16"
                  align="center"
                  style={{ fontWeight: "normal" }}
                >
                  Web Scraper can visit multiple levels of a website
                </H2>
              </Fade>
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-center">
              <Zoom>
                <img
                  src="https://i.ibb.co/7CVXCn5/2.png"
                  className="img-fluid"
                  alt="img_icon"
                  style={{ maxWidth: "80%", height: "auto" }}
                />
              </Zoom>
              <Fade bottom>
                <H3 color="black" size="20" align="center">
                  JavaScript execution
                </H3>
                <H2
                  color="black"
                  size="16"
                  align="center"
                  style={{ fontWeight: "normal" }}
                >
                  Web sites are rendered completely
                </H2>
              </Fade>
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-center">
              <Zoom>
                <img
                  src="https://i.ibb.co/ssnp12J/3.png"
                  className="img-fluid"
                  alt="img_icon"
                  style={{ maxWidth: "80%", height: "auto" }}
                />
              </Zoom>
              <Fade bottom>
                <H3 color="black" size="20" align="center">
                  E-commerce scraping
                </H3>
                <H2
                  color="black"
                  size="16"
                  align="center"
                  style={{ fontWeight: "normal" }}
                >
                  Built-in selectors for easy e-commerce site scraping
                </H2>
              </Fade>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-center">
              <Zoom>
                <img
                  src="https://i.ibb.co/nD8RHGF/4.png"
                  className="img-fluid"
                  alt="img_icon"
                  style={{ maxWidth: "80%", height: "auto" }}
                />
              </Zoom>
              <Fade bottom>
                <H3 color="black" size="20" align="center">
                  Scheduler
                </H3>
                <H2
                  color="black"
                  size="16"
                  align="center"
                  style={{ fontWeight: "normal" }}
                >
                  Scrape a site on hourly, daily or weekly basis
                </H2>
              </Fade>
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-center">
              <Zoom>
                <img
                  src="https://i.ibb.co/2YGdM1K/5.png"
                  className="img-fluid"
                  alt="img_icon"
                  style={{ maxWidth: "80%", height: "auto" }}
                />
              </Zoom>
              <Fade bottom>
                <H3 color="black" size="20" align="center">
                  Proxy
                </H3>
                <H2
                  color="black"
                  size="16"
                  align="center"
                  style={{ fontWeight: "normal" }}
                >
                  IP rotation through thousands of IP addresses
                </H2>
              </Fade>
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-center">
              <Zoom>
                <img
                  src="https://i.ibb.co/JdkKDpg/6.png"
                  className="img-fluid"
                  alt="img_icon"
                  style={{ maxWidth: "80%", height: "auto" }}
                />
              </Zoom>
              <Fade bottom>
                <H3 color="black" size="20" align="center">
                  Data export
                </H3>
                <H2
                  color="black"
                  size="16"
                  align="center"
                  style={{ fontWeight: "normal" }}
                >
                  Automate data export to CSV, Excel etc.
                </H2>
              </Fade>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-center">
              <Zoom>
                <img
                  src="https://i.ibb.co/4TdpN66/7.png"
                  className="img-fluid"
                  alt="img_icon"
                  style={{ maxWidth: "80%", height: "auto" }}
                />
              </Zoom>
              <Fade bottom>
                <H3 color="black" size="20" align="center">
                  API
                </H3>
                <H2
                  color="black"
                  size="16"
                  align="center"
                  style={{ fontWeight: "normal" }}
                >
                  Manage scrapers through an API
                </H2>
              </Fade>
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-center">
              <Zoom>
                <img
                  src="https://i.ibb.co/0jCptHd/8.png"
                  className="img-fluid"
                  alt="img_icon"
                  style={{ maxWidth: "80%", height: "auto" }}
                />
              </Zoom>
              <Fade bottom>
                <H3 color="black" size="20" align="center">
                  Webhooks
                </H3>
                <H2
                  color="black"
                  size="16"
                  align="center"
                  style={{ fontWeight: "normal" }}
                >
                  Receive web notification when a job is finished
                </H2>
              </Fade>
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 text-center">
              <Zoom>
                <img
                  src="https://i.ibb.co/YQbz9jR/9.png"
                  className="img-fluid"
                  alt="img_icon"
                  style={{ maxWidth: "80%", height: "auto" }}
                />
              </Zoom>
              <Fade bottom>
                <H3 color="black" size="20" align="center">
                  Scalable
                </H3>
                <H2
                  color="black"
                  size="16"
                  align="center"
                  style={{ fontWeight: "normal" }}
                >
                  Web Scraper is built on cloud technologies and can scale with
                  you
                </H2>
              </Fade>
              <div style={{ marginBottom: "50px" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
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
)(Home);

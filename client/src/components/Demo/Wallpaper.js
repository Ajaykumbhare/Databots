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

class Wallpaper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      images: [],
      spinner: false,
      download: false,
      errors: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.download = this.download.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.keyword.trim() !== "") {
      this.setState({ spinner: true });
      try {
        return Promise.all(R.range(0, 1)).mapSeries(async x => {
          const { data: { photos } } = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURI(this.state.keyword)}&per_page=10`, {
            headers: { Authorization: "563492ad6f917000010000011a1d8d7fb945486f8c12d2ade9a4344c" }
          });
          let images = photos.map(({ src }) => src.landscape);
          if (images.length > 0) {
            this.setState({ images: images });
          } else {
            alert("images not found");
          }
          this.setState({ spinner: false });
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
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  download() {
    this.setState({ download: true });
    const images = Array.from(document.querySelectorAll(".img-fluid")).map(x =>
      x.getAttribute("src")
    );

    let jsonObject = {
      url: images
    };

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
    const { errors, images } = this.state;
    let image_html = [];
    if (images.length > 0) {
      images.map(x =>
        image_html.push(
          <div className="col-lg-3 col-md-4 col-xs-6 thumb" key={x}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={x.split("?").shift()}
            >
              <img src={x} className="zoom img-fluid" alt="pexels" />
            </a>
          </div>
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
                    <H2 size={"40"}>Beautiful, free photos</H2>
                  </Fade>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <Fade top>
                    <H3 size={"25"}>
                      The best free stock photos shared by talented
                      photographers.
                      <br />
                      Gifted by the world’s most generous community of
                      photographers
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
              <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 ">
                <label>Search Keyword</label>
                <TextFieldGroup
                  placeholder="Keyword"
                  name="keyword"
                  value={this.state.keyword}
                  onChange={this.onChange}
                  error={errors.keyword}
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

          <div className="row">{image_html}</div>
          {image_html.length > 0 ? (
            <Button
              color="purple"
              style={{ marginLeft: "12px" }}
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

Wallpaper.propTypes = {
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
)(Wallpaper);

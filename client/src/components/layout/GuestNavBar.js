import React, { Component } from "react";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";
import { Nav } from "./Style";
import Button from "../common/Button";

class GuestNavBar extends Component {
  render() {
    return (
      <div>
        <Nav className="navbar fixed-top navbar-expand-lg navbar-light">
          <Fade left>
            <Link className="navbar-brand d-inline" to="/">
              <img
                src="https://i.ibb.co/rfv5bFP/Da-3.png"
                style={{ width: "166px", height: "47px" }}
                alt="logo"
              />
            </Link>
          </Fade>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/">
                  Web Scraper
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Try/YellowPages">
                  YellowPages
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/Try/Wallpaper">
                  Image Search Bot
                </Link>
              </li>

              {/* <li className="nav-item">
                <Link className="nav-link" to="/">
                  Learn
                </Link>
              </li> */}
            </ul>
            <div className="form-inline my-2 my-lg-0">
              <Link to="/login">
                <Button>Login</Button>
              </Link>

              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </Nav>
      </div>
    );
  }
}

export default GuestNavBar;

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";

const Wrapper = styled.footer`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 0 ${({ isAuthenticated }) => (isAuthenticated ? "8px" : "24px")};
  background-color: white;
  a {
    text-decoration: none;
    color: #2196f3;
  }
`;

const Text = styled.p`
  font-size: 13px;
  font-weight: 300;
  color: #666;
  @media only screen and (max-width: 768px) {
    font-size: 11px;
  }
`;

class Footer extends Component {
  render() {
    return !this.props.isAuthenticated ? (
      <Wrapper isAuthenticated={this.props.isAuthenticated}>
        <Text>
          Made with love by{" "}
          <a href="www.databots.com/" title="Databots">
            DataBots
          </a>
          {" | "}
          <a href="/terms" title="Terms of Service">
            Terms of Service
          </a>
          {" | "}
          <a href="/report" title="Report abuse">
            Report Abuse
          </a>
        </Text>
      </Wrapper>
    ) : (
      ""
    );
  }
}

Footer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated
});

export default connect(mapStateToProps)(Footer);

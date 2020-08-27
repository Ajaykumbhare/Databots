import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const Spinner = ({ style, type }) => {
  return (
    <div
      className={classnames(`spinner-border text-${type}`)}
      style={style}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Spinner.propTypes = {
  type: PropTypes.string,
  style: PropTypes.object
};

Spinner.defaultProps = {
  type: "light",
  style: {
    width: "12px",
    height: "12px",
    fontSize: "10px"
  }
};

export default Spinner;

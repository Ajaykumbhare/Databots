import React from "react";
import { FaArrowRight, FaSearch, FaUser, FaUserShield } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function AdminNav() {
  return (
    <div>
      <li className="nav-item">
        <a
          className="nav-link"
          data-toggle="collapse"
          href="#ui-usernav"
          aria-expanded="false"
          aria-controls="ui-usernav"
        >
          <FaUser />
          <span style={{ marginLeft: "10px" }} className="menu-title">
            Users
          </span>
          <FaArrowRight style={{ marginLeft: "auto" }} />
        </a>
        <div className="collapse" id="ui-usernav">
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/addAdmin">
                <FaUserShield />
                <span style={{ marginLeft: "5px" }} className="menu-title">
                  Add Users
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/viewAdmins">
                <FaSearch />
                <span style={{ marginLeft: "5px" }} className="menu-title">
                  View Users
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </li>
    </div>
  );
}

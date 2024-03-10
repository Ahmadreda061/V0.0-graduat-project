import React from "react";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar--nav d-flex-between-center ">
          <div className="nav--logo">
            <img src={logo} />
          </div>
          <ul className="nav--paths d-flex-between-center">
            <li className="nav--paths_path">
              <Link to="/">home</Link>
            </li>
            <li className="nav--paths_path">
              <Link>my profile</Link>
            </li>
            <li className="nav--paths_path">
              <Link>explore</Link>
            </li>
            <li className="nav--paths_path">
              <Link>
                <button className="btn">become vendor</button>
              </Link>
            </li>
            <li className="nav--paths_path nav-sign">
              <Link>
                <button className="btn">Register</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

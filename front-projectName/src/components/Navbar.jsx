import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import "../style/navbar.css";

function Navbar() {
  const [bars, setBars] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  useEffect(() => {
    /* when window be less than 876 will bars shows */
    const handleResize = () => {
      setBars(window.innerWidth < 876);
    };

    // Initial check
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const styles = {
    // inline style to ul when clicked bar show paths otherwise hide it
    right: showPaths ? 0 : "-1000px",
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar--nav d-flex-between-center ">
          <div className="nav--logo">
            <img src={logo} />
          </div>
          {bars && (
            <i
              onClick={() => setShowPaths(true)}
              className="fa-solid fa-bars"
            />
          )}
          <ul
            style={styles}
            className={`${bars && "active"} nav--paths d-flex-between-center`}
          >
            {bars && (
              <i
                onClick={() => setShowPaths(false)}
                className="fa-solid fa-xmark"
              ></i>
            )}
            <li>
              <Link to="/" className="nav--paths_path">
                home
              </Link>
            </li>
            <li>
              <Link className="nav--paths_path">my profile</Link>
            </li>
            <li>
              <Link className="nav--paths_path">explore</Link>
            </li>
            <li className="nav-btn">
              <Link className="nav--paths_path">
                <button className="btn">become vendor</button>
              </Link>
            </li>
            <li className="nav-btn">
              <Link className="nav--paths_path ">
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

import React, { useState, useEffect } from "react";
import Logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import "../style/components-style/navbar.css";

function Navbar() {
  const [bars, setBars] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setBars(window.innerWidth < 920);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // if the landing page reg out if the view the reg in nav bar will show
    const handleScroll = () => {
      const landingRegister = document.querySelector(".landing .text-btn");
      const navbarRegister = document.querySelector(".navbar .nav-btn");

      if (landingRegister && navbarRegister) {
        const landingRegisterRect = landingRegister.getBoundingClientRect();
        const navbarRegisterRect = navbarRegister.getBoundingClientRect();

        if (
          landingRegisterRect.top > window.innerHeight ||
          landingRegisterRect.bottom < 0
        ) {
          setShowRegister(true);
        } else {
          setShowRegister(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const styles = {
    right: showPaths ? 0 : "-1000px",
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar--nav d-flex-between-center ">
          <div className="nav--logo">
            <img src={Logo} alt="logo image" />
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
              <Link to="/" className="line nav--paths_link">
                home
              </Link>
            </li>
            <li>
              <Link className="line nav--paths_link">my profile</Link>
            </li>
            <li>
              <Link className="line nav--paths_link">explore</Link>
            </li>
            <li className="nav-btn">
              <Link className="line nav--paths_link">
                <button className="btn">become vendor</button>
              </Link>
            </li>
            {showRegister && (
              <li className="nav-btn">
                <Link className="line nav--paths_link">
                  <button className="btn">Register</button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

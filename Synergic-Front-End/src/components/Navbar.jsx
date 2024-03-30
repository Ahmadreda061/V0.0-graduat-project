import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import "../style/components-style/navbar.css";
import getImageUrl from "../utils/image-util";

function Navbar({ handleRegisterOverlay }) {
  const [bars, setBars] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [showRegisterBtn, setShowRegisterBtn] = useState(false);
  const userKey = localStorage.getItem("Key");

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
    // if the landing page register out if the view the reg in nav bar will show
    const handleScroll = () => {
      const landingRegister = document.querySelector(".landing .text-btn");
      const navbarRegister = document.querySelector(".navbar .nav-btn");
      if (landingRegister && navbarRegister) {
        const landingRegisterRect = landingRegister.getBoundingClientRect();
        landingRegisterRect.bottom < 0
          ? setShowRegisterBtn(true)
          : setShowRegisterBtn(false);
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
            <Link to="/">
              <img
                src={getImageUrl("logo.png")}
                alt="logo image"
                width={200}
                height={200}
              />
            </Link>
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
            {userKey && (
              <li>
                <Link to="/myprofile" className="line nav--paths_link">
                  my profile
                </Link>
              </li>
            )}
            <li>
              <Link to="/" className="line nav--paths_link">
                explore
              </Link>
            </li>
            <li className="nav-btn">
              <Link
                onClick={() => !userKey && handleRegisterOverlay()}
                to={userKey && "/vendorRegistertion"}
                className="line nav--paths_link"
              >
                <button className="btn">become vendor</button>
              </Link>
            </li>

            {!localStorage.getItem("Key") && showRegisterBtn ? (
              <li className="line nav-btn" onClick={handleRegisterOverlay}>
                <button className="btn">Register</button>
              </li>
            ) : (
              localStorage.getItem("Key") && (
                <li
                  className=" nav-btn line"
                  onClick={() => {
                    localStorage.removeItem("Key");
                    window.location.reload();
                  }}
                >
                  <button className="btn">Sign Out</button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

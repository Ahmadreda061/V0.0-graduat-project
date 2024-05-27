import React, { useState, useEffect, useContext } from "react";

import { Link, useLocation } from "react-router-dom";
import "../style/components-style/navbar.css";
import getImageUrl from "../utils/image-util";
import { userInfoContext } from "../App";
import Notfications from "../pages/myprofile/myprofile-component/Notfications";
import makeAllRead from "../utils/makeAllRead";

function Navbar({ handleRegisterOverlay, allNotificationsRead, makeAllRead }) {
  const { userInfo } = useContext(userInfoContext);
  const [showNoitifctions, setShowNoitifctions] = useState(false);

  const [bars, setBars] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [showRegisterBtn, setShowRegisterBtn] = useState(false);
  const userKey = localStorage.getItem("Key");
  const location = useLocation();
  const handleSignOut = () => {
    // when remove the key to sign out when u'r in a route depend to user will crash so when the user sign out will go to home page
    location.pathname = "http://localhost:5173/";
    localStorage.removeItem("Key");
  };

  useEffect(() => {
    const handleResize = () => {
      setBars(window.innerWidth < 1000);
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
      const navbarRegister = document.getElementById("nav-register-btn");
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
            <li>
              <Link to="/explore" className="line nav--paths_link">
                explore
              </Link>
            </li>
            {userKey && (
              <>
                <li>
                  <Link to="/myprofile" className="line nav--paths_link">
                    my profile
                  </Link>
                </li>

                <li>
                  <Link to="/chats" className="line nav--paths_link">
                    chats
                  </Link>
                </li>
              </>
            )}
            {userInfo && !userInfo.isVendor && (
              <li className="nav-btn">
                <Link
                  onClick={() => !userKey && handleRegisterOverlay()}
                  to={userKey && "/vendorRegistertion"}
                  className="line nav--paths_link"
                >
                  <button className="btn">become vendor</button>
                </Link>
              </li>
            )}

            {!userInfo && showRegisterBtn ? (
              <li className="line nav-btn" onClick={handleRegisterOverlay}>
                <button className="btn" id="nav-register-btn">
                  Register
                </button>
              </li>
            ) : (
              localStorage.getItem("Key") && (
                <li className="nav-btn line">
                  <Link to="/">
                    <button onClick={handleSignOut} className="btn">
                      Sign Out
                    </button>
                  </Link>
                </li>
              )
            )}
            {userInfo && (
              <li>
                <i
                  className="fa-regular fa-bell fa-fw nav--bell"
                  onClick={() => (
                    setShowNoitifctions((prevState) => !prevState),
                    makeAllRead()
                  )}
                ></i>
                {!allNotificationsRead && <span className="circle-red"></span>}
                {showNoitifctions && <Notfications />}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

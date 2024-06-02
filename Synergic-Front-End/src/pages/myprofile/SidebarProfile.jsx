import { Link } from "react-router-dom";
import "../../style/myprofile-style/sidebarProfile.css";
import { useContext, useState } from "react";
import getImageUrl from "../../utils/image-util";
import { userInfoContext } from "../../App";
import createRoom from "../chats/utils/createRoom";
// /(otherUserName || userInfo.isVendor) &&
function SidebarProfile({ otherUserName, otherUserInfo }) {
  //otherUserName is the other user
  //console.log(otherUserName);
  const { userInfo } = useContext(userInfoContext);
  const [activeLink, setActiveLink] = useState("myProfile");

  function handleClick(e) {
    const clickedLink = e.currentTarget.href;
    const indexOfLastSlash = clickedLink.lastIndexOf("/");
    setActiveLink(clickedLink.slice(indexOfLastSlash + 1));
  }

  const services = (
    <>
      <li>
        <Link
          style={
            activeLink === "services"
              ? { backgroundColor: "#f6f6f6", color: "#5371ff" }
              : { backgroundColor: "#fff" }
          }
          className="sidebar--page"
          onClick={handleClick}
          to="/myprofile/services"
        >
          <i className="fa-solid fa-diagram-project fa-fw"></i>
          <span>Services</span>
        </Link>
      </li>
    </>
  );
  return (
    <nav className="sidebar">
      <div className="sidebar--logo">
        <Link to="/">
          <img
            src={getImageUrl("logo.png")}
            alt="logo image"
            width={200}
            height={200}
          />
        </Link>
      </div>

      <ul className="sidebar--pages">
        <li>
          <Link
            style={
              activeLink === "myprofile"
                ? { backgroundColor: "#f6f6f6", color: "#5371ff" }
                : { backgroundColor: "#fff" }
            }
            className="sidebar--page"
            onClick={handleClick}
            to="/myprofile"
          >
            <i className="fa-regular fa-user fa-fw"></i>
            <span>Informations</span>
          </Link>
        </li>
        {!otherUserInfo
          ? userInfo.isVendor && services
          : otherUserInfo.isVendor && services}
        <li>
          <Link
            style={
              activeLink === "reviews"
                ? { backgroundColor: "#f6f6f6", color: "#5371ff" }
                : { backgroundColor: "#fff" }
            }
            className="sidebar--page"
            onClick={handleClick}
            to="/myprofile/reviews"
          >
            <i className="fa-regular fa-comment fa-fw"></i>
            <span>Reviews</span>
          </Link>
        </li>
        {otherUserName && (
          <li>
            <Link
              style={
                activeLink === "myprofile"
                  ? { backgroundColor: "#f6f6f6", color: "#5371ff" }
                  : { backgroundColor: "#fff" }
              }
              className="sidebar--page"
              to="/chats"
              onClick={() =>
                createRoom(
                  userInfo.userToken,
                  otherUserName,
                  userInfo.username + "to" + otherUserName
                )
              }
            >
              <button className="btn">Start Chat</button>
            </Link>
          </li>
        )}

        {userInfo.isVendor &&
          (userInfo.username == otherUserName || !otherUserName) && (
            <>
              <li>
                <Link
                  style={
                    activeLink === "requests"
                      ? { backgroundColor: "#f6f6f6", color: "#5371ff" }
                      : { backgroundColor: "#fff" }
                  }
                  className="sidebar--page"
                  onClick={handleClick}
                  to="/myprofile/requests"
                >
                  <i className="fa-regular fa-bell fa-fw"></i>
                  <span>Requests</span>
                </Link>
              </li>
            </>
          )}
        {!otherUserName && (
          <li>
            <Link
              style={
                activeLink === "actives"
                  ? { backgroundColor: "#f6f6f6", color: "#5371ff" }
                  : { backgroundColor: "#fff" }
              }
              className="sidebar--page"
              onClick={handleClick}
              to="/myprofile/actives"
            >
              <i className="fa-solid fa-spinner"></i>
              <span>Actives</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default SidebarProfile;

import { Link } from "react-router-dom";
import "../../style/myprofile-style/sidebarProfile.css";
import { useState } from "react";
import getImageUrl from "../../utils/image-util";
function SidebarProfile() {
  const [activeLink, setActiveLink] = useState("myProfile");
  function handleClick(e) {
    /*when cilcked each link will make it the clicked one
     using make the last path in href the value of active link 
    */
    const clickedLink = e.currentTarget.href;
    const indexOfLastSlash = clickedLink.lastIndexOf("/");
    setActiveLink(clickedLink.slice(indexOfLastSlash + 1));
  }
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
              activeLink == "myprofile"
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
        <li>
          <Link
            style={
              activeLink == "services"
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
        <li>
          <Link
            style={
              activeLink == "reviews"
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
        <li>
          <Link
            style={
              activeLink == "requests"
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
      </ul>
    </nav>
  );
}

export default SidebarProfile;

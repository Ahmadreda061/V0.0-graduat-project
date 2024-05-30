import axios from "axios";
import React, { useContext } from "react";
import { userInfoContext } from "../../../App";
import { Link } from "react-router-dom";

function ActiveCustomer(props) {
  const { userInfo } = useContext(userInfoContext);

  function handleCancle() {
    axios
      .post(
        `https://localhost:7200/api/Services/CancleActiveService?UserToken=${userInfo.userToken}&ActiveServiceID=${props.activeServiceID}`
      )
      .then((res) => {
        window.location.reload();
      });
  }

  function handleChat() {
    window.location = "/chats";
  }

  return (
    <div className="myprofile-card active-card">
      <div className="active--info">
        <span
          className={`stats-circle ${props.activeStatus ? "green" : "yheloo"}`}
        ></span>

        <p>
          You have an Active Requested Service
          <span style={{ color: "blue", marginLeft: "5px" }}>
            {props.serviceName}
          </span>{" "}
          With
          <Link
            onClick={window.location.reload}
            to={`/myprofile?UT=${props.serviceCustomerUsername}`}
            style={{ fontSize: "1.2rem", color: "blue", marginLeft: "5px" }}
          >
            {props.serviceOwnerUsername}
          </Link>
        </p>
      </div>
      <div className="active--buttons">
        <button className="btn " onClick={handleChat}>
          chat
        </button>
        <button
          className={`btn ${props.activeStatus ? "red" : "grey"}`}
          onClick={props.activeStatus ? handleCancle : () => null}
        >
          Cancle
        </button>
      </div>
    </div>
  );
}

export default ActiveCustomer;

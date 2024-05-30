import axios from "axios";
import React, { useContext, useState } from "react";
import { userInfoContext } from "../../../App";
import { Link } from "react-router-dom";

function ActtiveVendor(props) {
  // const [state, setState] = useState("active");
  const { userInfo } = useContext(userInfoContext);
  function handleFinsh() {
    axios
      .post(
        `https://localhost:7200/api/Services/FinishActiveService?UserToken=${userInfo.userToken}&ActiveServiceID=${props.activeServiceID}`
      )
      .then((res) => {
        window.location.reload();
      });
  }

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
        {/* <span style={{ position: "absolute", top: "0" }}>{state}</span> */}

        <p>
          You have an Active Service
          <span style={{ color: "blue", marginLeft: "5px" }}>
            {props.serviceName}
          </span>{" "}
          With
          <Link
            onClick={window.location.reload}
            to={`/myprofile?UT=${props.serviceCustomerUsername}`}
            style={{ fontSize: "1.2rem", color: "blue", marginLeft: "5px" }}
          >
            {props.serviceCustomerUsername}
          </Link>
        </p>
      </div>
      <div className="active--buttons">
        <button
          className={`btn ${props.activeStatus ? "green" : "grey"}`}
          onClick={props.activeStatus ? handleFinsh : () => null}
        >
          Finish
        </button>
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

export default ActtiveVendor;

import axios from "axios";
import React, { useContext } from "react";
import { userInfoContext } from "../../../App";

function Acttive({ msg, serviecId }) {
  const { userInfo } = useContext(userInfoContext);
  function handleFinsh() {
    // axios.post(
    //   `https://localhost:7200/api/Services/FinishActiveService?UserToken=${userInfo.userToken}&ActiveServiceID=${}`
    // );
  }

  function handleCancle() {
    //     axios.post(
    //   `https://localhost:7200/api/Services/CancleActiveService?UserToken=${userInfo.userToken}&ActiveServiceID=${}`
    // );
  }

  function handleChat() {
    window.location = "/chats";
  }

  return (
    <div className="myprofile-card active-card">
      <div className="active--info">
        <p>{msg}</p>
      </div>
      <div className="active--buttons">
        <button className="btn green" onClick={handleFinsh}>
          Finsh
        </button>
        <button className="btn " onClick={handleChat}>
          chat
        </button>
        <button className="btn red" onClick={handleCancle}>
          Cancle
        </button>
      </div>
    </div>
  );
}

export default Acttive;

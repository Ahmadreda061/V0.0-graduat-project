import React from "react";
import giveTime from "../../utils/giveTime";

function MyMsg(props) {
  const time = giveTime(props.time);
  return (
    <li className="my-msg ">
      <img
        src={`data:image/png;base64,${props.img}`}
        alt="my profile image"
        className="my-msg--img circle"
      />

      <p className="my-msg--info">
        {props.msg}
        <span style={{ opacity: "0", left: "-40px" }}>{time}</span>
      </p>
    </li>
  );
}

export default MyMsg;

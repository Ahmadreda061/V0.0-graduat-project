import React from "react";
import giveTime from "../../utils/giveTime";

function OtherMsg(props) {
  const time = giveTime(props.time);

  return (
    <li className="other-msg">
      <p className="other-msg--info">
        {" "}
        <span style={{ opacity: "0", right: "-40px" }}>{time}</span>
        {props.msg}
      </p>
      <img
        src={`data:image/png;base64,${props.img}`}
        alt="other profile image"
        className="other-msg--img circle"
      />
    </li>
  );
}

export default OtherMsg;

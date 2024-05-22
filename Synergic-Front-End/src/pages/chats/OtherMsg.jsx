import React from "react";
import getImageUrl from "../../utils/image-util";

function OtherMsg() {
  return (
    <li className="other-msg">
      <p className="other-msg--info">
        Lorem ipsum, dolor sit amet consectetur adipisicing. Lorem ipsum, dolor
        sit amet consectetur adipisicing. sit amet consectetur adipisicing.
      </p>
      <img
        src={getImageUrl("DefaultProfileImage.png")}
        alt="other profile image"
        className="other-msg--img circle"
      />
    </li>
  );
}

export default OtherMsg;

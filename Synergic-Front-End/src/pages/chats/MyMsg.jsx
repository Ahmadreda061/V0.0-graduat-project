import React from "react";
import getImageUrl from "../../utils/image-util";

function MyMsg() {
  return (
    <li className="my-msg ">
      <img
        src={getImageUrl("DefaultProfileImage.png")}
        alt="my profile image"
        className="my-msg--img circle"
      />
      <p className="my-msg--info">
        Lorem ipsum, dolor sit amet consectetur adipisicing.
      </p>
    </li>
  );
}

export default MyMsg;

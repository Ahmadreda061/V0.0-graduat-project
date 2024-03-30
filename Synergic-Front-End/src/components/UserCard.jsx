import { useContext } from "react";
import { userInfoContext } from "../App";
import "../style/components-style/uesrCard.css";
import Loading from "./Loding";
function UserCard() {
  const userInfo = useContext(userInfoContext);
  if (!userInfo) {
    return <Loading />;
  }
  const { profilePicture, fName, lName } = userInfo;

  return (
    <div className="user-card">
      <img
        src={`data:image/png;base64,${profilePicture}`}
        alt="User Image"
        className="user--image"
      />
      <p className="user--name">
        <span className="first-name">{fName} </span>
        <span className="last-name">{lName}</span>
      </p>
      <p className="user--bio">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure esse...
      </p>
      <span className="user--rate">⭐⭐⭐⭐</span>
    </div>
  );
}

export default UserCard;

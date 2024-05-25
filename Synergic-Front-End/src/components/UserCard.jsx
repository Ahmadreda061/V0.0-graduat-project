import { useState, useEffect } from "react";
import DropDown from "./DropDown";
import AddReview from "./AddReview";
import Loading from "./Loding";
import "../style/components-style/uesrCard.css";
import fetchUserRating from "../utils/fetchUserRating";

function UserCard(props) {
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    fetchUserRating(props.username)
      .then((rating) => {
        setUserRating(Math.floor(rating));
      })
      .catch((error) => {
        console.error("Error fetching user rating:", error);
      });
  }, [props.username]);

  const { profilePicture, fName, lName, username } = props;

  return (
    <div className="user-card">
      <div className={`user--image `}>
        {props.serviceOwnerToken && (
          <span className="rating">{userRating}⭐</span>
        )}
        <img src={`data:image/png;base64,${profilePicture}`} alt="User Image" />
        <div className="dropdown">
          <DropDown
            serviceOwnerToken={props.serviceOwnerToken}
            setUserInfo={props.setUserInfo}
          />
        </div>
      </div>

      <p className="user--name">
        <span className="first-name">{fName} </span>
        <span className="last-name">{lName}</span>
      </p>

      <span className="user--rate">
        {props.serviceOwnerToken ? (
          <>
            <AddReview username={username} submit={props.submit} />
          </>
        ) : userRating ? (
          "⭐".repeat(userRating)
        ) : (
          "No Rating Yet"
        )}
      </span>
    </div>
  );
}

export default UserCard;

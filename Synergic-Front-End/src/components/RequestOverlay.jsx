import { useEffect, useState } from "react";
import "../style/components-style/requestOverlay.css";
import fetchUserRating from "../utils/fetchUserRating";
function RequestOverlay(props) {
  const [rating, setRating] = useState(0);
  const comment = props.messageContent
    .substring(props.messageContent.indexOf("saying:") + 7)
    .trim();
  const title = props.messageContent.substring(
    props.messageContent.indexOf("(") + 1,
    props.messageContent.indexOf(")")
  );

  useEffect(() => {
    fetchUserRating(props.senderUsername).then((data) => {
      setRating(data);
    });
  }, []);
  return (
    <div
      className="request-overlay overlay"
      onClick={props.handleReguestOverlay}
    >
      <div
        className="request-overlay--card"
        onClick={(e) => e.stopPropagation()}
      >
        <i
          className="fa-solid fa-xmark"
          onClick={props.handleReguestOverlay}
        ></i>
        <div className="overlay--card-top">
          <div className="card-top--customer-info">
            <img
              src={`data:image/png;base64,${props.senderPP}`}
              alt="customer img"
            />
            <div>
              <span className="customer-info--name">
                {props.senderUsername}
              </span>
              <span className="customer-info--rating">
                {rating ? "⭐".repeat(rating) : "There is No Rating"}
              </span>
            </div>
          </div>
          <div className="card-top--request-info">
            <h2 className="request-info--service-name">{title}</h2>
            <span className="request-info--service-price">24$</span>
          </div>
        </div>
        <div className="overlay--card-down">
          <p className="card-down--comment">
            <span>Comment</span>
            {comment}
          </p>
          <div className="card-down--btns">
            <button className="btn green">Accept</button>
            <button className="btn red">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestOverlay;

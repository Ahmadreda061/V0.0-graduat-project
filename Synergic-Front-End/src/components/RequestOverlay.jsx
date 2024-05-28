import { useContext, useEffect, useState } from "react";
import "../style/components-style/requestOverlay.css";
import fetchUserRating from "../utils/fetchUserRating";
import { userInfoContext } from "../App";
import createRoom from "../pages/chats/utils/createRoom";
import axios from "axios";
import getImageUrl from "../utils/image-util";
function RequestOverlay(props) {
  const { userInfo } = useContext(userInfoContext);

  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchUserRating(props.senderUsername).then((data) => {
      setRating(data);
    });
  }, []);

  function handleRejectRequest() {
    props.setShowDetails(false);
    axios
      .post(
        `https://localhost:7200/api/Services/RejectServiceRequest?UserToken=${userInfo.userToken}&ServiceID=${props.serviceID}&RequesterName=${props.senderUsername}`
      )
      .then(() => {
        props.setRequests((prevReq) =>
          prevReq.filter((req) => req.serviceID != props.serviceID)
        );
      });
  }

  function handleAcceptRequest() {
    createRoom(
      userInfo.userToken,
      props.senderUsername,
      `${userInfo.username}to${props.senderUsername}`
    )
      .then((chatId) => {
        console.log(chatId)

        return axios.post(
          `https://localhost:7200/api/Services/AcceptServiceRequest?UserToken=${userInfo.userToken}&ServiceID=${props.serviceID}&RequesterName=${props.senderUsername}&ChatID=${chatId}`
        );
      })
      .then((res) => {
        console.log(res)
        props.setRequests((prevReq) =>
          prevReq.filter((req) => req.serviceID != props.serviceID)
        );
      })
      .then(() => {
        setTimeout(() => (window.location = "/chats"), 500);
      });
  }
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
            <h2 className="request-info--service-name">{props.title}</h2>
            <span className="request-info--service-price">{props.price}$</span>
          </div>
        </div>
        <div className="overlay--card-down">
          <p className="card-down--comment">
            <span>Comment</span>
            {props.comment}
          </p>
          <div className="card-down--btns">
            <button className="btn green" onClick={handleAcceptRequest}>
              Accept
            </button>
            <button className="btn red" onClick={handleRejectRequest}>
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestOverlay;

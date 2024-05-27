import { Link } from "react-router-dom";
import "../../../style/myprofile-style/notfications.css";
import { formatDistanceToNow } from "date-fns";

function Notfication(props) {
  const sendTimeDate = new Date(props.sendTime);

  const relativeTime = formatDistanceToNow(sendTimeDate);
  return (
    <Link
      to={`/myprofile/${
        props.notificationCategory == 1
          ? "requests"
          : props.notificationCategory == 2
          ? "reviews"
          : ""
      }`}
      style={{ color: "black" }}
    >
      <hr />
      <div className="notfication">
        <img src={`data:image/png;base64,${props.senderPP}`} alt="user image" />
        <div className="notfication--msg-content">
          <p className="content--title">
            {/* <span style={{ color: "#3f5be3", fontSize: "1.4rem" }}>sads</span> */}
            {props.messageContent}
          </p>
        </div>
        {relativeTime && (
          <span className="notfication--time">{relativeTime}</span>
        )}
      </div>
    </Link>
  );
}

export default Notfication;

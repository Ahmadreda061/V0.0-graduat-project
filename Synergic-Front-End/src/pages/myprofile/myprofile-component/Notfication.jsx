import { Link } from "react-router-dom";
import "../../../style/myprofile-style/notfications.css";
import { formatDistanceToNow } from "date-fns";
import { useContext } from "react";
import { userInfoContext } from "../../../App";
import setNotficationRead from "../../../utils/setNotficationRead";

function Notfication(props) {
  const { userInfo } = useContext(userInfoContext);
  const sendTimeDate = new Date(props.sendTime);

  const relativeTime = formatDistanceToNow(sendTimeDate);
  console.log(props.NotificationID);
  return (
    <Link
      to="/myprofile/requests"
      style={{ color: "black" }}
      onClick={() =>
        setNotficationRead(userInfo.userToken, props.NotificationID)
      }
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

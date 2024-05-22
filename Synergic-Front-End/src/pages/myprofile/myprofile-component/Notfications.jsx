import { useContext, useEffect } from "react";
import "../../../style/myprofile-style/notfications.css";
import Notfication from "./Notfication";
import { userInfoContext } from "../../../App";

function Notfications() {
  const { notifications } = useContext(userInfoContext);

  const notificationElements = notifications
    .reverse()
    .map((notfication, index) => {
      notfication = JSON.parse(notfication);
      console.log(notfication.NotificationID);
      const content = notfication.content;
      return (
        <Notfication
          key={index}
          NotificationID={notfication.NotificationID}
          {...content}
        />
      );
    });

  return (
    <div className="notfications-body">
      <h3>Notifications</h3>
      <div className="notfications-items">{notificationElements}</div>
    </div>
  );
}

export default Notfications;

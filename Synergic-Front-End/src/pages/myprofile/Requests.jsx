import { useContext, useEffect, useState } from "react";
import "../../style/myprofile-style/request.css";
import Request from "./myprofile-component/Request";
import { userInfoContext } from "../../App";
import getUserNotfications from "../../utils/getUserNotfications";
function Requests() {
  const { userInfo } = useContext(userInfoContext);
  const [requests, setRequests] = useState([]);
  console.log(requests);
  useEffect(() => {
    getUserNotfications(userInfo.userToken).then((notfications) => {
      const newRequests = notfications.filter(
        (notfication) => notfication.notificationCategory == 1
      );
      setRequests(newRequests);
    });
  }, []);
  const requestElements = requests.map((request, index) => {
    const content = request.content;
    return (
      <Request
        key={index}
        senderUsername={content.senderUsername}
        senderPP={content.senderPP}
        messageContent={content.messageContent}
      />
    );
  });

  return <div className="myprofile-cards request-cards">{requestElements}</div>;
}

export default Requests;

import { useContext, useEffect, useState } from "react";
import "../../style/myprofile-style/request.css";
import Request from "./myprofile-component/Request";
import { userInfoContext } from "../../App";
import getRecievedRequests from "./utils/getRecievedRequests";

function Requests() {
  const { userInfo } = useContext(userInfoContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getRecievedRequests(userInfo.userToken).then((requests) => {
      console.log(requests);
      setRequests(requests);
    });
  }, [userInfo.userToken]);

  if (requests?.length === 0) {
    return <div>No requests found.</div>;
  }

  const requestElements = requests.map((request, index) => {
    return <Request key={index} {...request} setRequests={setRequests} />;
  });

  return <div className="myprofile-cards request-cards">{requestElements}</div>;
}

export default Requests;

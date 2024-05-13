import "../../style/myprofile-style/services.css";
import AddServiceCard from "../../components/AddServiceCard";
import ServiceCard from "../../components/ServiceCard";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userInfoContext } from "../../App";
import { UserTokenContext } from "./Myprofile";

function Services() {
  const serviceOwnerInfo = useContext(UserTokenContext);

  const [userSerivces, setUserSerivces] = useState([]);
  const { userInfo } = useContext(userInfoContext);
  let { username } = userInfo;

  useEffect(() => {
    if (serviceOwnerInfo) username = serviceOwnerInfo.username;
    axios
      .get(
        `https://localhost:7200/api/Services/GetServices?Username=${username}&Count=${100000}` // the 6 will change to all to get the num dynmaic
      )
      .then((res) => setUserSerivces(res.data));
  }, []);
  const serviceCards = userSerivces.map((service, index) => (
    <ServiceCard {...service} key={index} />
  ));
  return (
    <div className="myprofile-cards">
      {serviceCards}
      {!serviceOwnerInfo && <AddServiceCard />}
    </div>
  );
}

export default Services;

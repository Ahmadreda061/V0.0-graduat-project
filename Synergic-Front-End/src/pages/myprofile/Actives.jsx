import React, { useContext, useEffect, useState } from "react";
import Acttive from "./myprofile-component/Acttive";
import "../../style/myprofile-style/actives.css";
import getVendorActiveServices from "./utils/getVendorActiveServices";
import { userInfoContext } from "../../App";
function Actives() {
  const { userInfo } = useContext(userInfoContext);
  const [actives, setActives] = useState([]);
  useEffect(() => {
    getVendorActiveServices(userInfo.userToken).then((actives) =>
      setActives(actives)
    );
  }, []);
  console.log(actives);

  if (actives?.length === 0) {
    return <div>No requests found.</div>;
  }

  const activesElements = actives.map((active, index) => {
    return <Acttive key={index} {...active} setActives={setActives} />;
  });
  return <div className="myprofile-cards actives-cards">{activesElements}</div>;
}

export default Actives;

import React, { useContext, useEffect } from "react";
import Acttive from "./myprofile-component/Acttive";
import "../../style/myprofile-style/actives.css";
import getVendorActiveServices from "./utils/getVendorActiveServices";
import { userInfoContext } from "../../App";
function Actives() {
  const { userInfo } = useContext(userInfoContext);
  useEffect(() => {
    getVendorActiveServices(userInfo.userToken);
  }, []);
  return (
    <div className="myprofile-cards actives-cards">
      <Acttive msg="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum!" />
      <Acttive msg="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum!" />
      <Acttive msg="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum!" />
    </div>
  );
}

export default Actives;

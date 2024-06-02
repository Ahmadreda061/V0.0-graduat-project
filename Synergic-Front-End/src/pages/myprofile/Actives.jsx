import React, { useContext, useEffect, useState } from "react";
import ActtiveVendor from "./myprofile-component/ActtiveVendor";
import "../../style/myprofile-style/actives.css";
import getVendorActiveServices from "./utils/getVendorActiveServices";
import { userInfoContext } from "../../App";
import getCustomerActiveServices from "./utils/getCustomerActiveServices";
import ActiveCustomer from "./myprofile-component/ActiveCustomer";
function activesVendor() {
  const { userInfo } = useContext(userInfoContext);
  const [activesVendor, setactivesVendor] = useState([]);
  const [activesCustomer, setactivesCustomer] = useState([]);
  useEffect(() => {
    getVendorActiveServices(userInfo.userToken).then((activesVendor) =>
      setactivesVendor(activesVendor)
    );
  }, []);

  useEffect(() => {
    getCustomerActiveServices(userInfo.userToken).then((activesCustomer) =>
      setactivesCustomer(activesCustomer)
    );
  }, []);

  if (activesVendor?.length === 0 && activesCustomer?.length === 0) {
    return <div>No requests found.</div>;
  }

  const activesVendorElements = activesVendor.map((active, index) => {
    return <ActtiveVendor key={index} {...active} />;
  });

  const activesCustomerElements = activesCustomer.map((active, index) => {
    return <ActiveCustomer key={index} {...active} />;
  });

  return (
    <div className="active  ">
      {activesVendor.length > 0 && (
        <>
          <h3 style={{ color: "blue", fontSize: "2rem" }}>Services To Do</h3>
          <div className="myprofile-cards actives-cards">
            {activesVendorElements}
          </div>
        </>
      )}

      {activesCustomer.length > 0 && (
        <h3 style={{ color: "blue", fontSize: "2rem" }}>My Active Services</h3>
      )}

      <div className="myprofile-cards actives-cards">
        {activesCustomerElements}
      </div>
    </div>
  );
}

export default activesVendor;

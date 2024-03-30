import React, { useContext, useEffect, useState } from "react";
import PaymentForm from "../components/PaymentForm";
import Visa from "../components/Visa";
import useFormReducer from "../utils/useFormReducer";
import "../style/vendor-reg.css";
import axios from "axios";
import { userInfoContext } from "../App";
import Loading from "../components/Loding";
function vendorReg() {
  // there is a bug in the page when backend completed i will continue work here

  const [user, setUser] = useState({ password: "testtest" }); // change it
  const userInfo = useContext(userInfoContext);
  if (!userInfo) return <Loading />;
  const [errors, setErrors] = useState({});
  const initPaymentData = {
    cardholderName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  };
  const { formData, change } = useFormReducer(initPaymentData, setErrors);
  useEffect(() => {
    axios
      .get(
        `https://localhost:7200/api/Accounts/GetProfile?UserToken=${localStorage.getItem(
          "Key"
        )}`
      )
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        const { username, userToken } = data;
        setUser((prevuser) => ({ ...prevuser, username, userToken }));
      });
  }, []);

  return (
    <>
      <div className="container">
        <div className="wall"></div>
        <header className="vendor-Reg">
          <Visa formData={formData} />
          <div className="payment-method">
            <div className="payment--text" style={{ textAlign: "center" }}>
              <h2
                className="payment--text-header title"
                style={{ marginBottom: 0, fontSize: "3rem" }}
              >
                Hey {userInfo.username}
              </h2>
              <p className="payment--text-description description">
                You want to be a vendor add your payment method first
              </p>
            </div>
            <PaymentForm
              formData={formData}
              change={change}
              setError={setErrors}
              errors={errors}
              user={user}
            />
          </div>
        </header>
      </div>
    </>
  );
}

export default vendorReg;

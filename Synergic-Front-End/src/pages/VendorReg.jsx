import React, { useContext, useState } from "react";
import PaymentForm from "../components/PaymentForm";
import Visa from "../components/Visa";
import useFormReducer from "../utils/useFormReducer";
import "../style/vendor-reg.css";
import { userInfoContext } from "../App";
import Loading from "../components/Loding";
import arrayToObj from "../utils/ArraytoObj";
function vendorReg() {
  const { userInfo } = useContext(userInfoContext);
  const { username, userToken } = userInfo;
  if (!userToken) return <Loading />;
  const [errors, setErrors] = useState({});
  const formFields = [
    {
      name: "cardholderName",
      label: "CARDHOLDER NAME",
      placeholder: "e.g Ahmad Reda",
      field: "INPUT",
    },
    {
      name: "cardNumber",
      label: "CARD NUMBER",
      placeholder: "0000 0000 0000 0000",
      maxLength: "16",
      field: "cardnumber",
    },
    {
      name: "expMonth",
      label: "MM",
      placeholder: "00",
      maxLength: "2",
      field: "INPUT",
    },
    {
      name: "expYear",
      label: "YY",
      placeholder: "00",
      maxLength: "2",
      field: "INPUT",
    },
    {
      name: "cvc",
      label: "CVC",
      placeholder: "000",
      maxLength: "3",
      field: "INPUT",
    },
  ];

  const initPaymentData = arrayToObj(formFields, "name");
  const { formData, change } = useFormReducer(
    { ...initPaymentData, password: "" },
    setErrors
  );

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
                Hey {username}
              </h2>
              <p className="payment--text-description description">
                You want to be a vendor add your payment method first
              </p>
            </div>
            <PaymentForm
              formFields={formFields}
              formData={formData}
              change={change}
              setError={setErrors}
              errors={errors}
              user={{ username, userToken }}
            />
          </div>
        </header>
      </div>
    </>
  );
}

export default vendorReg;

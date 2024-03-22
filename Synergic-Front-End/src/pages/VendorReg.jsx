import React, { useState } from "react";
import "../style/vendor-reg.css";
import PaymentForm from "../components/PaymentForm";
import Visa from "../components/Visa";
import useFormReducer from "../utils/useFormReducer";

function vendorReg() {
  const [errors, setErrors] = useState({});
  const initPaymentData = {
    holderName: "",
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  };
  const { formData, change } = useFormReducer(initPaymentData, setErrors);

  return (
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
              Hey 'userName'
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
          />
        </div>
      </header>
    </div>
  );
}

export default vendorReg;

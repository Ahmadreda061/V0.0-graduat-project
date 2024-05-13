import axios from "axios";
import React, { useState } from "react";
import validateForm from "../utils/validateForm";
import createFormElements from "./CreateFormElements";
import ConfirmPass from "../components/ConfirmPass";

function PaymentForm(props) {
  const date = new Date();
  const [submitted, setSubmitted] = useState(false);
  const [cofirmPassword, setCofirmPassword] = useState(false);

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    const isValid = paymentValidateForm();
    if (isValid) {
      setCofirmPassword(true);
      if (props.formData.password) {
        // if there is data in the password post it
        axios
          .post(
            "https://localhost:7200/api/UserAuthentication/SignPaymentInfo",
            {
              user: { ...props.user, password: props.formData.password },
              ...props.formData,
              isVendor: true,
            }
          )
          .then((res) => {
            return res.data;
          })
          .then((data) => {
            if (data.statusCode === 0) {
              window.location.pathname = "/";
            }
            if (data.statusCode === 9) {
              props.setError((prevError) => ({
                ...prevError,
                general: data.statusMessage,
              }));
            }
            if (data.statusCode === 6) {
              props.setError((prevError) => ({
                ...prevError,
                password: "*incorect password",
              }));
            }
          });
      }
    }
  }
  function paymentValidateForm() {
    const newErrors = validateForm(props.formData, true);

    // invalid month
    if (
      props.formData.expMonth &&
      (1 > props.formData.expMonth || props.formData.expMonth > 12)
    ) {
      newErrors["expMonth"] = "*Invalid";
    }

    // invalid Card Number
    if (props.formData.cardNumber.length < 16)
      newErrors["cardNumber"] = "* Must be more than 16 char's";

    // invalid exp date
    const expYear = props.formData.expYear;
    if (
      expYear < date.getFullYear() % 100 ||
      (expYear == date.getFullYear() % 100 &&
        props.formData.expMonth < date.getMonth())
    )
      newErrors["general"] = "*expiration date must be in the future ";
    else {
      delete newErrors["general"];
    }

    props.setError(newErrors);
    return (
      Object.keys(newErrors).length === 0 || Object.keys(newErrors).length === 1
    );
  }

  function handleConfirmPass() {
    setCofirmPassword((prevState) => !prevState);
    return cofirmPassword;
  }

  const FormElements = createFormElements(
    props.formFields,
    props.errors,
    props.change,
    submitted
  );
  return (
    <form className="payment--form " onSubmit={submit}>
      <div className="formElements">{FormElements}</div>
      {cofirmPassword && (
        <ConfirmPass
          value={props.formData.password}
          change={props.change}
          error={props.errors.password}
          cofirmPassword={cofirmPassword}
          handleConfirmPass={handleConfirmPass}
        />
      )}
      <span className="required" style={{ fontSize: "1rem", display: "block" }}>
        {props.errors["general"]}
      </span>
      <button className="btn">Confirm</button>
    </form>
  );
}

export default PaymentForm;

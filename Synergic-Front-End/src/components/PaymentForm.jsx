import axios from "axios";
import React, { useState } from "react";

function PaymentForm(props) {
  const [submitted, setSubmitted] = useState(false);
  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    const isValid = validateForm();
    if (isValid) {
      // const user = props.user;
      // const formData = props.formData;
      axios
        .post("https://localhost:7200/api/UserAuthentication/SignVendor", {
          user: props.user,
          ...props.formData,
        })
        .then((res) => console.log(res));
    }
  }

  function validateForm() {
    const requiredFields = [
      "cardholderName",
      "cardNumber",
      "expMonth",
      "expYear",
      "cvc",
    ];
    const newErrors = {};
    // Validate required fields
    requiredFields.forEach((field) => {
      if (!props.formData[field]) {
        newErrors[field] = "*Required";
      }
    });
    // invalid month
    if (
      props.formData.expMonth &&
      (1 > props.formData.expMonth || props.formData.expMonth > 12)
    ) {
      newErrors["expMonth"] = "*Invalid";
    }
    props.setError(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  return (
    <form className="payment--form " onSubmit={submit}>
      <label htmlFor="cardholderName">
        CARDHOLDER NAME
        {props.errors.cardholderName && submitted && (
          <span className="required">{props.errors.cardholderName}</span>
        )}
      </label>
      <input
        type="text"
        name="cardholderName"
        id="cardholderName"
        value={props.formData.cardholderName}
        onChange={(e) => props.change(e, "INPUT")}
        placeholder="e.g Ahmad Reda"
      />
      <label htmlFor="cardNumber">
        CARD NUMBER
        {props.errors.cardNumber && submitted && (
          <span className="required">{props.errors.cardNumber}</span>
        )}
      </label>
      <input
        type="text"
        name="cardNumber"
        id="cardNumber"
        value={props.formData.cardNumber}
        onChange={(e) => props.change(e, "cardnumber")}
        placeholder="0000 0000 0000 0000 "
        maxLength="19"
      />
      <div className="input-togthor">
        <div style={{ flex: "none" }}>
          <label htmlFor="expMonth">
            MM
            {props.errors.expMonth && submitted && (
              <span className="required">{props.errors.expMonth}</span>
            )}
          </label>
          <input
            type="text"
            name="expMonth"
            id="expMonth"
            value={props.formData.expMonth}
            onChange={(e) => props.change(e, "INPUT")}
            placeholder="00"
            maxLength="2"
          />
        </div>

        <div style={{ flex: "1" }}>
          <label htmlFor="expYear">
            YY
            {props.errors.expYear && submitted && (
              <span className="required">{props.errors.expYear}</span>
            )}
          </label>
          <input
            type="text"
            name="expYear"
            id="expYear"
            value={props.formData.expYear}
            onChange={(e) => props.change(e, "INPUT")}
            placeholder="00"
            maxLength="2"
          />
        </div>
        <div style={{ textAlign: "-webkit-right" }}>
          <label
            htmlFor="cvc"
            style={{
              right: `${props.errors.cvc ? "-13px" : "54px"}`,
              position: "relative",
            }}
          >
            CVC
            {props.errors.cvc && submitted && (
              <span className="required">{props.errors.cvc}</span>
            )}
          </label>
          <input
            type="text"
            name="cvc"
            id="cvc"
            value={props.formData.cvc}
            onChange={(e) => props.change(e, "INPUT")}
            placeholder="000"
            maxLength="3"
          />
        </div>
      </div>
      <button className="btn">Confirm</button>
    </form>
  );
}

export default PaymentForm;

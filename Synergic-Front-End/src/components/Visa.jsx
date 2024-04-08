import React from "react";

function Visa({ formData }) {
  return (
    <div className="visa-cards">
      <div className="front-card">
        <div className="front-card-info">
          <i className="fa-brands fa-cc-visa"></i>
          <h2 className="info--card-number">
            {formData.cardNumber ? formData.cardNumber : "0000 0000 0000 0000"}
          </h2>
          <div className="info--bottom">
            <h4 className="bottom--name">
              {formData.cardholderName ? formData.cardholderName : "Enter Name"}
            </h4>
            <span className="bottom--exp-date">
              {formData.expMonth ? formData.expMonth : "00"}/
              {formData.expYear ? formData.expYear : "00"}
            </span>
          </div>
        </div>
      </div>
      <div className="back-card">
        <div className="back-card-info">
          <span className="cvc">{formData.cvc ? formData.cvc : "000"}</span>
        </div>
      </div>
    </div>
  );
}

export default Visa;

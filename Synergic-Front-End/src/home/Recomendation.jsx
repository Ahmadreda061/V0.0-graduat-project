import { Link } from "react-router-dom";
import data from "./dammyRec";
import { useState } from "react";
import "../style/home-style/recomendation.css";
import CardRec from "./CardRec";
function Recomendation() {
  const [curentIndex, setCurentIndex] = useState(0);
  const recomendations = data;
  const cardRecomendations = recomendations.map((recomendation, index) => (
    <CardRec
      key={recomendation.id}
      {...recomendation}
      render={index === curentIndex}
    />
  ));

  function nextCard() {
    setCurentIndex(
      (prevCurentIndex) => (prevCurentIndex + 1) % recomendations.length
    );
  }

  function prevCard() {
    setCurentIndex((prevCurentIndex) =>
      prevCurentIndex === 0 ? recomendations.length - 1 : prevCurentIndex - 1
    );
  }

  const circleElemnts = recomendations.map((item, index) => (
    <span
      style={{ height: "40px", width: "40px" }}
      key={index}
      className={`circle card-selector ${
        curentIndex === index ? "selected" : ""
      }`}
      onClick={() => setCurentIndex(index)}
    ></span>
  ));

  return (
    <section className="recomendations">
      <h2 className="section--header">
        <Link to="" className="line">
          Recomendations
        </Link>
      </h2>
      <div className="recomendation--cards">
        <button
          aria-label="scroll"
          onClick={prevCard}
          className="scroll-button circle"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        {cardRecomendations[curentIndex]}
        <button
          aria-label="scroll"
          onClick={nextCard}
          className="scroll-button circle right"
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      <div className="recomendation--selectors">{circleElemnts}</div>
    </section>
  );
}

export default Recomendation;

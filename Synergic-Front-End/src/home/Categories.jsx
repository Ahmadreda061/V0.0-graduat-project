import React, { useState } from "react";
import "../style/home-style/categories.css";
import { Link } from "react-router-dom";
import CardCategory from "../components/CardCategory";
function Categories(props) {
  const [mostRecentCate, setMostRecentCate] = useState([]); // When get the the Most Caregories create function to update the state

  return (
    <section className="categories">
      <h2 className="section--header">
        <Link to="" className="line">
          Categories
        </Link>
      </h2>
      <div className="categories--cards " ref={props.containerRef}>
        <button
          aria-label="scroll"
          className="scroll-button left circle"
          onClick={props.scrollLeft}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <CardCategory />
        <CardCategory />
        <CardCategory />
        <CardCategory />
        <CardCategory />
        <CardCategory />
        <CardCategory />
        <CardCategory />
        <button
          aria-label="scroll"
          className="scroll-button right circle"
          onClick={props.scrollRight}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
}

export default Categories;

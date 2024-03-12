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
          className="scroll-button left circle"
          onClick={props.scrollLeft}
        >
          &lt;
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
          className="scroll-button right circle"
          onClick={props.scrollRight}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}

export default Categories;

import React, { useState } from "react";
import "../style/home-style/categories.css";
import { Link } from "react-router-dom";
import CardCategory from "../components/CardCategory";
function Categories() {
  const [mostRecentCate, setMostRecentCate] = useState([]);
  // When get the the Most Caregories create function to update the state

  return (
    <section className="categories">
      <h2 className="section--header">
        <Link to="" className="line">
          Categories
        </Link>
      </h2>
      <div className="categories--cards">
        <CardCategory />
        <CardCategory />
        <CardCategory />
        <CardCategory />
        <CardCategory />
      </div>
    </section>
  );
}

export default Categories;

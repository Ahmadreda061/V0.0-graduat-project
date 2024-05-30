import React, { useState } from "react";
import "../style/home-style/categories.css";
import { Link } from "react-router-dom";
import CardCategory from "../components/CardCategory";
function Categories(props) {
  const categories = [
    { categoryName: "Web Development", categoryImg: "webCate.jpg", cateId: 0 },
    { categoryName: "Games Development", categoryImg: "games.jpg", cateId: 1 },
    { categoryName: "Mobile Apps", categoryImg: "mobile.jpg", cateId: 2 },
    { categoryName: "Windows Apps", categoryImg: "desktop.png", cateId: 3 },
    { categoryName: "3D Modeling", categoryImg: "3d.jpg", cateId: 4 },
    { categoryName: "UI/UX", categoryImg: "ui.webp", cateId: 5 },
  ];
  const cardsElements = categories.map((cate, index) => (
    <CardCategory key={index} {...cate} />
  ));
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

        {cardsElements}

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

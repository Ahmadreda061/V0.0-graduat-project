import React, { useState, useRef } from "react";
import "../../style/explore/filtter.css";

function Filtter(props) {
  const [showCates, setShowCates] = useState(false);
  const [showStars, setShowStars] = useState(false);

  const checkboxesRef = useRef([]);
  const radiosRef = useRef([]);

  function handleShowCates() {
    setShowCates((prevState) => !prevState);
  }

  function handleShowStars() {
    setShowStars((prevState) => !prevState);
  }
  function handleCategoryChange(event) {
    const { value, checked } = event.target;
    props.setCategories((prevSelected) => {
      if (checked) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter((category) => category !== value);
      }
    });
  }

  function handleSearchBar(event) {
    const { value } = event.target;
    props.setSearchBar(value);
  }

  function handleRatingChange(event) {
    const { value } = event.target;
    props.setRating(value);
  }

  function handleClearFilter() {
    props.setRating("");

    if (props.category.length > 0) {
      props.setCategories([]);
    }
    // props.setR ating(-1);
    checkboxesRef.current.forEach((checkbox) => {
      checkbox.checked = false;
    });

    radiosRef.current.forEach((radio) => {
      radio.checked = false;
    });
  }

  return (
    <div className="content-filter">
      <div className="search-bar">
        <input
          type="text"
          name="search"
          value={props.searchBar}
          placeholder="Service to Search."
          onChange={handleSearchBar}
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>
      <form className={`filter-categories ${showCates ? "active" : ""}`}>
        <div className="filter-header">
          <h3 style={{ marginRight: "15px" }}>Categories</h3>
          <span onClick={handleShowCates}>
            {showCates ? (
              <i className="fa-solid fa-minus"></i>
            ) : (
              <i className="fa-solid fa-plus"></i>
            )}
          </span>
        </div>
        {["web", "Games", "Mobile", "Windows", "3D", "UI/UX"].map(
          (label, index) => {
            const value = (index ).toString();
            return (
              <div key={value}>
                <input
                  type="checkbox"
                  id={label.toLowerCase()}
                  value={value}
                  onChange={handleCategoryChange}
                  ref={(el) => (checkboxesRef.current[index] = el)}
                  checked={props.category.includes(value)}
                />
                <label htmlFor={label.toLowerCase()}>{label}</label>
              </div>
            );
          }
        )}
      </form>

      <form className={`filter-rating ${showStars ? "active" : ""}`}>
        <div className="filter-header">
          <h3 style={{ marginRight: "15px" }}>Rating</h3>
          <span onClick={handleShowStars}>
            {showStars ? (
              <i className="fa-solid fa-minus"></i>
            ) : (
              <i className="fa-solid fa-plus"></i>
            )}
          </span>
        </div>
        {[1, 2, 3, 4, 5].map((label, index) => (
          <div key={label}>
            <input
              type="radio"
              id={`star${label}`}
              name="starRating"
              value={label}
              onChange={handleRatingChange}
              ref={(el) => (radiosRef.current[index] = el)}
              checked={props.rating === label.toString()}
            />
            <label htmlFor={`star${label}`}>{"⭐".repeat(label)}</label>
          </div>
        ))}
      </form>

      <button className="btn" onClick={handleClearFilter}>
        Clear Filter
      </button>
    </div>
  );
}

export default Filtter;

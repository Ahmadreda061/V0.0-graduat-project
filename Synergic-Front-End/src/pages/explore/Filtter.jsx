import React, { useEffect, useState, useRef } from "react";
import "../../style/explore/filtter.css";

function Filtter({ onFilterChange }) {
  const [showCates, setShowCates] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const checkboxesRef = useRef([]);

  function handleShowCates() {
    setShowCates((prevState) => !prevState);
  }

  function handleCategoryChange(event) {
    const { value, checked } = event.target;
    setSelectedCategories((prevSelected) => {
      if (checked) {
        return [...prevSelected, value];
      } else {
        return prevSelected.filter((category) => category !== value);
      }
    });
  }

  useEffect(() => {
    onFilterChange(selectedCategories);
  }, [selectedCategories, onFilterChange]);

  function handleClearFilter() {
    setSelectedCategories([]);
    checkboxesRef.current.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  return (
    <div className="content-filter">
      <form className={`filter-categories ${showCates ? "active" : ""}`}>
        <div className="filter-header">
          <h3 style={{ marginRight: "15px" }}>Categories </h3>
          <span onClick={handleShowCates}>
            {showCates ? (
              <i className="fa-solid fa-minus"></i>
            ) : (
              <i className="fa-solid fa-plus"></i>
            )}
          </span>
        </div>
        {["dum1", "dum2", "dum3", "dum4", "dum5", "Other"].map(
          (label, index) => {
            const value = (index + 1).toString();
            return (
              <div key={value}>
                <input
                  type="checkbox"
                  id={label.toLowerCase()}
                  value={value}
                  onChange={handleCategoryChange}
                  ref={(el) => (checkboxesRef.current[index] = el)}
                  checked={selectedCategories.includes(value)}
                />
                <label htmlFor={label.toLowerCase()}>{label}</label>
              </div>
            );
          }
        )}
      </form>
      <button className="btn" onClick={handleClearFilter}>
        Clear Filter
      </button>
    </div>
  );
}

export default Filtter;

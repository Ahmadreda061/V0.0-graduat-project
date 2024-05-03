import { useState } from "react";
import "../../style/explore/filtter.css";

function Filtter() {
  const [showCates, setShowCates] = useState(false);
  function handaleShowCates() {
    setShowCates((prevState) => !prevState);
  }

  const [showRating, setShowRating] = useState(false);
  function handaleShowRating() {
    setShowRating((prevState) => !prevState);
  }
  return (
    <div className="content-filter">
      <form className={`filter-categories ${showCates ? "active" : ""}`}>
        <div className="filter-header">
          <h3>Categories</h3>
          <span onClick={handaleShowCates}>
            {showCates ? (
              <i className="fa-solid fa-minus"></i>
            ) : (
              <i className="fa-solid fa-plus"></i>
            )}
          </span>
        </div>
        <div>
          <input type="checkbox" id="web" name="web" value="1" />
          <label htmlFor="web">Web</label>
        </div>
        <div>
          <input type="checkbox" id="dum2" name="dum2" value="2" />
          <label htmlFor="dum2">dum2</label>
        </div>
        <div>
          <input type="checkbox" id="dum3" name="dum3" value="3" />
          <label htmlFor="dum3">dum3</label>
        </div>
        <div>
          <input type="checkbox" id="dum4" name="dum4" value="4" />
          <label htmlFor="dum4">dum4</label>
        </div>
        <div>
          <input type="checkbox" id="dum5" name="dum5" value="5" />
          <label htmlFor="dum5">dum5</label>
        </div>
        <div>
          <input type="checkbox" id="other" name="other" value="6" />
          <label htmlFor="other">Other</label>
        </div>
      </form>
      <form className={`filter-rating ${showRating ? "active" : ""}`}>
        <div className="filter-header">
          <h3>Rating</h3>
          <span onClick={handaleShowRating}>
            {showRating ? (
              <i className="fa-solid fa-minus"></i>
            ) : (
              <i className="fa-solid fa-plus"></i>
            )}
          </span>
        </div>
        <div>
          <input type="checkbox" id="star1" name="star1" value="1" />
          <label htmlFor="star1">⭐</label>
        </div>
        <div>
          <input type="checkbox" id="star2" name="star2" value="2" />
          <label htmlFor="star2">⭐⭐</label>
        </div>
        <div>
          <input type="checkbox" id="star3" name="star3" value="3" />
          <label htmlFor="star3">⭐⭐⭐</label>
        </div>
        <div>
          <input type="checkbox" id="star4" name="star4" value="4" />
          <label htmlFor="star4">⭐⭐⭐⭐</label>
        </div>
        <div>
          <input type="checkbox" id="star5" name="star5" value="5" />
          <label htmlFor="star5">⭐⭐⭐⭐⭐</label>
        </div>
      </form>
      <button className="btn">Clear Filter </button>
    </div>
  );
}

export default Filtter;

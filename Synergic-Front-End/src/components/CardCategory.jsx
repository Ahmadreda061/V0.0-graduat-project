import { Link } from "react-router-dom";
import "../style/components-style/cardcategory.css";
import getImageUrl from "../utils/image-util";

function CardCategory(props) {
  return (
    <Link
      to="/explore"
      onClick={() => localStorage.setItem("category", props.cateId)}
    >
      <div className="card--category">
        <div className="image">
          <img src={getImageUrl(props.categoryImg)} alt="category image card" />
        </div>
        <div className="card--text">
          <h3 className="text--title">{props.categoryName}</h3>
        </div>
      </div>
    </Link>
  );
}

export default CardCategory;

import "../style/components-style/cardcategory.css";
import getImageUrl from "../utils/image-util";

function CardCategory() {
  return (
    <div className="card--category">
      <div className="image">
        <img src={getImageUrl("img_5terre.jpg")} alt="category image card" />
      </div>
      <div className="card--text">
        <p className="text--description">Lorem ipsum dolor sit.</p>
        <h3 className="text--title">Lorem.</h3>
      </div>
    </div>
  );
}

export default CardCategory;

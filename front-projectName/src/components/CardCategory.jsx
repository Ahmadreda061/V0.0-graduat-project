import "../style/components-style/cardcategory.css";
import image from "../assets/images/6f80e98e963ec175d0a48ac1c5e2ea05.jpg";
function CardCategory() {
  return (
    <div className="card--category">
      <div className="image">
        <img src={image} alt="background image" />
      </div>
      <div className="card--text">
        <p className="text--description">Lorem ipsum dolor sit.</p>
        <h3 className="text--title">Lorem.</h3>
      </div>
    </div>
  );
}

export default CardCategory;

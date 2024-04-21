import { Link } from "react-router-dom";
import "../style/components-style/addServiceCard.css";
function AddServiceCard() {
  return (
    <div className="service-card add-service">
      <Link to="/serviceCreation">
        <button className="btn circle">
          <i className="fa-solid fa-plus"></i>
        </button>
      </Link>
    </div>
  );
}
export default AddServiceCard;

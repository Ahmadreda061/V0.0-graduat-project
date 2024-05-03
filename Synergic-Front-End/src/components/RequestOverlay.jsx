import "../style/components-style/requestOverlay.css";
import getImageUrl from "../utils/image-util";
function RequestOverlay(props) {
  return (
    <div
      className="request-overlay overlay"
      onClick={props.handleReguestOverlay}
    >
      <div
        className="request-overlay--card"
        onClick={(e) => e.stopPropagation()}
      >
        <i
          className="fa-solid fa-xmark"
          onClick={props.handleReguestOverlay}
        ></i>
        <div className="overlay--card-top">
          <div className="card-top--customer-info">
            <img
              src={getImageUrl("DefaultProfileImage.png")}
              alt="customer img"
            />
            <div>
              <span className="customer-info--name">{props.name}</span>
              <span className="customer-info--rating">
                {"⭐".repeat(props.rating)}
              </span>
            </div>
          </div>
          <div className="card-top--request-info">
            <h2 className="request-info--service-name">{props.title}</h2>
            <span className="request-info--service-price">{props.price}$</span>
          </div>
        </div>
        <div className="overlay--card-down">
          <p className="card-down--comment">
            <span>Comment</span>
            {props.comment}
          </p>
          <div className="card-down--btns">
            <button className="btn green">Accept</button>
            <button className="btn red">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestOverlay;

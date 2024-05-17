import getImageUrl from "../../../utils/image-util";
function Review({ msg, rating, senderUsername, senderPP }) {
  return (
    <div className="myprofile-card review-card ">
      <img
        src={`data:image/png;base64,${senderPP}`}
        alt="customer image"
        className="customer-img "
        width="200"
      />
      <h3 className="review--fullname">
        <span className="fname">{senderUsername} </span>
      </h3>
      <span className="review--rating">{"⭐".repeat(rating)}</span>
      <p className="review--detiles">{msg}</p>
    </div>
  );
}

export default Review;

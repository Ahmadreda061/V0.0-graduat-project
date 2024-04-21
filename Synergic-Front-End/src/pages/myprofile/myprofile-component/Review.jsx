import getImageUrl from "../../../utils/image-util";
function Review({ msg }) {
  return (
    <div className="myprofile-card review-card ">
      <img
        src={getImageUrl("DefaultProfileImage.png")}
        alt="customer image"
        className="customer-img "
        width="200"
      />
      <h3 className="review--fullname">
        <span className="fname">Ahmad </span>
        <span className="lname">Reda</span>
      </h3>
      <span className="review--rating">⭐⭐⭐</span>
      <p className="review--detiles">{msg}</p>
    </div>
  );
}

export default Review;

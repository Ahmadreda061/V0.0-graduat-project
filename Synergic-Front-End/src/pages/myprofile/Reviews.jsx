import Review from "./myprofile-component/Review";
import "../../style/myprofile-style/reviews.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userInfoContext } from "../../App";
function Reviews() {
  const { userInfo } = useContext(userInfoContext);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    axios
      .get(
        `https://localhost:7200/api/Accounts/GetReview?Username=${userInfo.username}`
      )
      .then((res) => res.data)
      .then((data) => setReviews(data.contents));
  }, []);

  const reviewElements = reviews.map((review, index) => (
    <Review
      key={index}
      msg={review.review}
      rating={review.rating}
      senderUsername={review.senderUsername}
      senderPP={review.senderPP}
    />
  ));
  return (
    <div className="container">
      <div className="myprofile-cards reviews-cards">
        {reviews.length ? reviewElements : "No Reviews Yet"}
      </div>
    </div>
  );
}

export default Reviews;

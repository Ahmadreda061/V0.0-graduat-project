import Review from "./myprofile-component/Review";
import "../../style/myprofile-style/reviews.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userInfoContext } from "../../App";
import { UserTokenContext } from "./Myprofile";
function Reviews() {
  const serviceOwnerInfo = useContext(UserTokenContext); // other user if exist
  const { userInfo } = useContext(userInfoContext);
  const [reviews, setReviews] = useState([]);

  let { username } = userInfo;

  useEffect(() => {
    if (serviceOwnerInfo) username = serviceOwnerInfo.username;
    axios
      .get(`https://localhost:7200/api/Accounts/GetReview?Username=${username}`)
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

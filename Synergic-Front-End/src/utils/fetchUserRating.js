import axios from "axios";

export default function fetchUserRating(username) {
    return new Promise((resolve, reject) => {
        axios
        .get(
          `https://localhost:7200/api/Accounts/GetReview?Username=${username}`
        )
        .then((res) => res.data)
        .then((data) => {
          const sumRating = data.contents.reduce(
            (acc, review) => acc + parseInt(review.rating),
            0
          );
          const rating = sumRating / data.contents.length;
            resolve(Math.round(rating));
        }); })
       
      
}


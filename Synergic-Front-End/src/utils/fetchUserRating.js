import axios from "axios";

export default function fetchUserRating(username) {
    return new Promise((resolve, reject) => {
        axios
        .get(
          `https://localhost:7200/api/Accounts/GetRating?Username=${username}`
        )
        .then((res) => res.data)
        .then((data) => {
            resolve(data.rating);
        }); })
       
      
}


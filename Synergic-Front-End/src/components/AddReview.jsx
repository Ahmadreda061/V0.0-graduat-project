import { useContext, useState } from "react";
import "../style/components-style/addreview.css";
import StarRating from "./StarRatiog";
import { userInfoContext } from "../App";
import axios from "axios";
function AddReview({ username, submit }) {
  const [rating, setRating] = useState(0);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { userInfo } = useContext(userInfoContext);
  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    const isValid = validReview();
    if (isValid) {
      const sender = {
        username: userInfo.username,
        userToken: userInfo.userToken,
        password: "http://localhost:5173/", // passwrod will remove
      };
      axios
        .post("https://localhost:7200/api/Accounts/PostReview", {
          sender,
          targetUsername: username,
          review: msg,
          rating: rating,
        })
        .then((res) => {
          if (res.data.statusCode === 0) {
            alert("review send successfuly");
          }
        });
    }
  }
  function validReview() {
    if (!msg) {
      setErrors((prevErrors) => ({ ...prevErrors, msg: "*Reqierd" }));
    }
    if (!rating) {
      setErrors((prevErrors) => ({ ...prevErrors, rating: "*Reqierd" }));
    }
    return Object.keys(errors).length > 0;
  }
  function change(e) {
    setMsg(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, msg: "" }));
  }
  return (
    <div className="review-msg">
      {errors.msg && submitted && (
        <span className="required">{errors.msg}</span>
      )}
      <textarea
        name="review"
        id="review"
        placeholder="Write your Review Here"
        value={msg}
        onChange={change}
      ></textarea>
      {errors.rating && submitted && (
        <span className="required">{errors.rating}</span>
      )}
      <StarRating rating={rating} setRating={setRating} setErrors={setErrors} />
      <button className="btn" type="submit" onClick={submit}>
        Add Review
      </button>
    </div>
  );
}

export default AddReview;

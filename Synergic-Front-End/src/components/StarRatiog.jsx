import "../style/components-style/StarRating.css";

function StarRating({ rating, setRating, setErrors }) {
  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    setErrors((prevErrors) => ({ ...prevErrors, rating: "" }));
  };
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "star selected" : "star"}
          onClick={() => handleStarClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;

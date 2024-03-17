import { useContext } from "react";
import "../style/home-style/landingPage.css";
import getImageUrl from "../utils/image-util";
import { showRegisterContext } from "../App";
function LandingPage() {
  const handeleShowReg = useContext(showRegisterContext);

  return (
    <div className="landing">
      <div className="landing--text">
        <h1 className="text-header">
          <span className="title">SYNERGIC.</span> ALL WE DO
        </h1>
        <p className="description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quaerat
          dicta nobis facilis, quod impedit, perferendis repudiandae quas, nemo
          veniam suscipit aut!
        </p>
        {!localStorage.getItem("account") ? (
          <button className="text-btn btn" onClick={handeleShowReg}>
            Register
          </button>
        ) : (
          <button className="text-btn btn">Show More</button>
        )}
      </div>
      <div className="landing--hero">
        <div className="hero-image">
          <img
            src={getImageUrl("landingImage.jpg")}
            alt="hero image"
            width={200}
            height={200}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

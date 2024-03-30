import "../style/home-style/landingPage.css";
import getImageUrl from "../utils/image-util";
function LandingPage({ handleRegisterOverlay }) {
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
        {!localStorage.getItem("Key") ? (
          <button className="text-btn btn" onClick={handleRegisterOverlay}>
            Register
          </button>
        ) : (
          <button className="text-btn btn">Show More</button>
        )}
      </div>
      <div className="landing--hero">
        <div className="hero-image">
          <img
            src={getImageUrl("landingImage-min.png")}
            alt="hero image"
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

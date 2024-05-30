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
          Welcome to Synergic!Discover a world of possibilities with Synergic,
          where you can explore and access a diverse range of services offered
          by our vibrant community. Whether you're looking to learn something
          new, find professional help, or offer your own expertise, start your
          journey with Synergic!
        </p>

        {!localStorage.getItem("Key") ? (
          <button className="text-btn btn" onClick={handleRegisterOverlay}>
            Sign Up
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

import landingImage from "../assets/images/landingImage.jpg";
import "../style/home-style/landingPage.css";
function LandingPage() {
  return (
    <header className="landing">
      <div className="landing--text">
        <h1 className="text-header">
          <span>SYNERGIC.</span> ALL WE DO
        </h1>
        <p className="text-discraption">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quaerat
          dicta nobis facilis, quod impedit, perferendis repudiandae quas, nemo
          veniam suscipit aut!
        </p>
        <button className="text-btn btn">Register</button>
      </div>
      <div className="landing--hero">
        <div className="hero-image">
          <img src={landingImage} alt="" />
        </div>
      </div>
    </header>
  );
}

export default LandingPage;

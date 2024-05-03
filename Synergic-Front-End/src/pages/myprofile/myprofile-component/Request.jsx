import { useState } from "react";
import RequestOverlay from "../../../components/RequestOverlay";
import getImageUrl from "../../../utils/image-util";

function Request() {
  const [showDetails, setShowDetails] = useState(false);
  // will get the request here or the requests will all gets in requests so add it as props
  const request = {
    name: "ahmad reda",
    title: "creemao ldao",
    rating: "4",
    price: 23,
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quibusdam nam veritatis!Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quibusdam nam veritatis!",
    description:
      "tates ensure that proposed locations comply with all relevant regulations and permits, including building codes, health standards, and safety requirements. Public Input and Engagement: States may involve public input and community engagement in the location selection process to understand concerns and gather feedback.tates ensure that proposed locations comply with all relevant regulations and pertates ensure that proposed locations comply with all relevant regulations and permits, including building codes, health standards, and safety requirements. Public Input and Engagement: States may involve public input and community engagement in the location selection process to understand concerns and gather feedback.tates ensure that proposed locations comply with all relevant regulations and per",
  };
  function handleReguestOverlay() {
    setShowDetails((prevState) => !prevState);
  }
  return (
    <div className="myprofile-card request-card ">
      <img
        src={getImageUrl("DefaultProfileImage.png")}
        alt="customer image"
        className="customer-img "
        width="200"
      />
      <p className="request--msg">
        Ahmad Reda was Requesting the serivce creemao ldao
      </p>
      <button className="btn" onClick={handleReguestOverlay}>
        Show Details
      </button>
      {showDetails && (
        <RequestOverlay
          {...request}
          handleReguestOverlay={handleReguestOverlay}
        />
      )}
    </div>
  );
}

export default Request;

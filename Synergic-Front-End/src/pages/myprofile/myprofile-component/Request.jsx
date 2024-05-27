import { useState } from "react";
import RequestOverlay from "../../../components/RequestOverlay";

function Request({ senderUsername, senderPP, messageContent, comment }) {
  const [showDetails, setShowDetails] = useState(false);
  // will get the request here or the requests will all gets in requests so add it as props

  function handleReguestOverlay() {
    setShowDetails((prevState) => !prevState);
  }
  return (
    <div className="myprofile-card request-card ">
      <img
        src={`data:image/png;base64,${senderPP}`}
        alt="customer image"
        className="customer-img "
        width="200"
      />
      <p className="request--msg">{messageContent}</p>
      <button className="btn" onClick={handleReguestOverlay}>
        Show Details
      </button>
      {showDetails && (
        <RequestOverlay
          senderUsername={senderUsername}
          senderPP={senderPP}
          messageContent={messageContent}
          handleReguestOverlay={handleReguestOverlay}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
}

export default Request;

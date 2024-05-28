import { useState } from "react";
import RequestOverlay from "../../../components/RequestOverlay";
import getImageUrl from "../../../utils/image-util";
import { Link } from "react-router-dom";

function Request(props) {
  const [showDetails, setShowDetails] = useState(false);
  // will get the request here or the requests will all gets in requests so add it as props

  function handleReguestOverlay() {
    setShowDetails((prevState) => !prevState);
  }
  return (
    <div className="myprofile-card request-card ">
      <img
        src={`data:image/png;base64,${props.serviceRequesterPP}`}
        // src={getImageUrl("DefaultProfileImage.png")}
        alt="customer image"
        className="customer-img "
        width="200"
      />
      <p className="request--msg">
        <Link
          onClick={window.location.reload}
          to={`/myprofile?UT=${props.serviceRequesterUsername}`}
          style={{ fontSize: "1.2rem", color: "blue", marginRight: "5px" }}
        >
          {props.serviceRequesterUsername}
        </Link>
        Is Requesting The Service. {props.serviceTitle}
      </p>
      <button className="btn" onClick={handleReguestOverlay}>
        Show Details
      </button>
      {showDetails && (
        <RequestOverlay
          senderUsername={props.serviceRequesterUsername}
          title={props.serviceTitle}
          comment={props.additionalComments}
          serviceID={props.serviceID}
          setRequests={props.setRequests}
          senderPP={props.serviceRequesterPP}
          price={props.servicePrice}
          handleReguestOverlay={handleReguestOverlay}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
}

export default Request;

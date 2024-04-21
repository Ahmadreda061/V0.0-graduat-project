import getImageUrl from "../../../utils/image-util";

function Request() {
  return (
    <div className="myprofile-card request-card ">
      <img
        src={getImageUrl("DefaultProfileImage.png")}
        alt="customer image"
        className="customer-img "
        width="200"
      />
      <p className="request--msg">
        Ahmad Reda was Requesting the serivce creemao ldao{" "}
      </p>
      <button className="btn">Show Detils</button>
    </div>
  );
}

export default Request;

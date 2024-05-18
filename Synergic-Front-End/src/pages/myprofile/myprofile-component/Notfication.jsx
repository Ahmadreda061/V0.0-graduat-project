import "../../../style/myprofile-style/notfications.css";
import getImageUrl from "../../../utils/image-util";
function Notfication(props) {
  return (
    <>
      <hr />
      <div className="notfication">
        <img src={getImageUrl("DefaultProfileImage.png")} alt="" />
        <div className="notfication--msg-content">
          <p className="content--title">
            <span style={{ color: "#3f5be3", fontSize: "1.4rem" }}>sads</span>{" "}
            Is requesting the service (new ssd)
          </p>
          <p className="content--comment">There is no comment</p>
        </div>
        <span className="notfication--time">1 minuts ago</span>
      </div>
    </>
  );
}

export default Notfication;

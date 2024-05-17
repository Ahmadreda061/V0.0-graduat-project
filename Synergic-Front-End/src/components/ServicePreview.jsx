import { useContext, useEffect, useRef, useState } from "react";
import "../style/components-style/servicePreview.css";
import { Link } from "react-router-dom";
import { userInfoContext } from "../App";
import sendServiceReq from "../utils/sendServiceReq";
import Loading from "./Loding";

function ServicePreview() {
  const { userInfo } = useContext(userInfoContext);
  const [mainImageIndex, setMainImage] = useState(0);
  const [serviceInfo, setServiceInfo] = useState({});
  const [comment, setComment] = useState(""); // New state for comment

  useEffect(() => {
    const serviceData = localStorage.getItem("serviceData");
    if (serviceData) {
      setServiceInfo(JSON.parse(serviceData));
    }
  }, []);

  if (!serviceInfo) {
    return <Loading />;
  }

  function callRequest() {
    sendServiceReq(
      userInfo.userToken,
      serviceInfo.serviceID,
      comment || "There is no Comment"
    ).then(alert("Request Send Successfly"));
  }

  const imagesContainerRef = useRef(null);
  const handleScrollLeft = () => {
    const container = imagesContainerRef.current;
    container.scrollBy({
      left: ((container.clientWidth + 20) / 3) * -1,
      behavior: "smooth",
    });
  };

  function handleScrollRight() {
    const container = imagesContainerRef.current;
    container.scrollBy({
      left: (container.clientWidth + 20) / 3,
      behavior: "smooth",
    });
  }

  function handleMainImage(index) {
    if (index !== mainImageIndex) {
      setMainImage(index);
    }
  }

  let images = [];
  if (serviceInfo.images) {
    images = serviceInfo.images.map((image, index) => (
      <img
        key={index}
        src={`data:image/png;base64,${image}`}
        alt={`service image ${index}`}
        onClick={() => handleMainImage(index)}
      />
    ));
  }
  const mainImage = images[mainImageIndex];
  const subImages = [
    ...images.slice(0, mainImageIndex),
    ...images.slice(mainImageIndex + 1),
  ];

  const serviceOwnerUsername = serviceInfo.serviceOwnerUsername;
  const serviceOwnerPic = serviceInfo.serviceOwnerPP;

  return (
    <div className="container">
      <div className="service-preview">
        <div className="service-preview--images">
          <div className="service-preview--serviceowenr">
            <Link to={`/myprofile?UT=${serviceOwnerUsername}`}>
              <img
                src={`data:image/png;base64,${serviceOwnerPic}`}
                alt="service Owner Image"
                className="service-owner-image"
              />
              {serviceOwnerUsername}
            </Link>
          </div>
          {mainImage}
          <div
            className="preview--images--addtional-images"
            ref={imagesContainerRef}
          >
            {subImages}
          </div>
          {images.length > 4 && (
            <>
              <button
                aria-label="scroll"
                className="scroll-button left circle"
                onClick={handleScrollLeft}
                style={{ bottom: "20px", top: "initial" }}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button
                aria-label="scroll"
                className="scroll-button right circle"
                onClick={handleScrollRight}
                style={{
                  bottom: "20px",
                  top: "initial",
                }}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </>
          )}
        </div>
        <div className="service-preview--info">
          <h1 className="preview--info--title title">{serviceInfo.title}</h1>
          <p className="preview--info--description description">
            {serviceInfo.description}
          </p>
          <form action="">
            <div className="form-element">
              <label htmlFor="comment">Optional Comment</label>
              <textarea
                name="comment"
                id="comment"
                placeholder="Add your comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
          </form>
          <span className="preview--info--price">${serviceInfo.price}</span>

          <button className="btn preview--info--req" onClick={callRequest}>
            Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServicePreview;

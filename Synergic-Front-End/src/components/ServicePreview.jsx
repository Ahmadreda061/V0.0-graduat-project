import { useContext, useEffect, useRef, useState } from "react";
import "../style/components-style/servicePreview.css";
import { Link, json } from "react-router-dom";
import { userInfoContext } from "../App";
import sendServiceReq from "../utils/sendServiceReq";
import Loading from "./Loding";
import YesOrNo from "./YesOrNo";
import getSentRequests from "../utils/getSentRequests";
import deleteServiceReq from "../utils/deleteServiceReq";
import markVisit from "../utils/markVisit";
function ServicePreview() {
  const { userInfo } = useContext(userInfoContext);
  const [mainImageIndex, setMainImage] = useState(0);
  const [serviceInfo, setServiceInfo] = useState({});
  const [comment, setComment] = useState(""); // New state for comment
  const [yesOrNoOverlay, setYesOrNoOverlay] = useState(false);
  const [requested, setReqested] = useState(false);

  function handleYesOrNo() {
    setYesOrNoOverlay((prevState) => !prevState);
  }

  useEffect(() => {
    const serviceData = localStorage.getItem("serviceData");
    if (serviceData) {
      const pasredServiceData = JSON.parse(serviceData)
      setServiceInfo(pasredServiceData );
      if (pasredServiceData.serviceOwnerUsername != userInfo.username) {
        // if I have this service will not mark as visted
        // console.log(serviceData)
        markVisit(userInfo.userToken, pasredServiceData.category);
      }
    }
  }, []);

  useEffect(() => {
    // get Requests
    getSentRequests(userInfo.userToken).then((requests) => {
      requests.map((request) => {
        if (request.serviceID == serviceInfo.serviceID) {
          setReqested(true);
        }
      });
    });
  }, [serviceInfo]);
  if (!serviceInfo) {
    return <Loading />;
  }

  function callRequest() {
    sendServiceReq(
      userInfo.userToken,
      serviceInfo.serviceID,
      comment || "There is no Comment"
    )
      .then(alert("Request Send Successfly"))
      .then((window.location = "/explore"));
  }
  function CancleRequest() {
    deleteServiceReq(userInfo.userToken, serviceInfo.serviceID).then(
      (res) => setReqested(!requested) // the res == true
    );
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
          {serviceOwnerPic && (
            <div className="service-preview--serviceowenr">
              <Link
                to={
                  serviceOwnerUsername != userInfo.username
                    ? `/myprofile?UT=${serviceOwnerUsername}`
                    : `/myprofile`
                }
              >
                <img
                  src={`data:image/png;base64,${serviceOwnerPic}`}
                  alt="service Owner Image"
                  className="service-owner-image"
                />
                {serviceOwnerUsername}
              </Link>
            </div>
          )}

          {mainImage}
          {subImages.length ? (
            <div
              className="preview--images--addtional-images"
              ref={imagesContainerRef}
            >
              {subImages}
            </div>
          ) : (
            ""
          )}

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
        <div
          className={`service-preview--info ${
            serviceInfo.serviceOwnerUsername == userInfo.username && "owner"
          }`}
          style={{ position: "relative" }}
        >
          {serviceInfo.serviceOwnerUsername == userInfo.username && (
            <i
              className="fa-solid fa-xmark"
              style={{ color: "red" }}
              onClick={handleYesOrNo}
            ></i>
          )}
          <h1 className="preview--info--title title">{serviceInfo.title}</h1>
          <p className="preview--info--description description">
            {serviceInfo.description}
          </p>
          {serviceInfo.serviceOwnerUsername != userInfo.username && (
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
          )}
          <span className="preview--info--price">${serviceInfo.price}</span>

          {serviceInfo.serviceOwnerUsername != userInfo.username && (
            <div className="preview--info--btns">
              <button
                className={`btn preview--info--req ${requested && "active"}`}
                onClick={!requested ? callRequest : () => null}
                style={{ flex: "1" }}
              >
                {requested ? "Requested" : "Request"}
              </button>
              {requested && (
                <button
                  className={`btn preview--info--req red`}
                  onClick={CancleRequest}
                >
                  cancle
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {yesOrNoOverlay && (
        <YesOrNo
          handleYesOrNo={handleYesOrNo}
          userToken={userInfo.userToken}
          serviceID={serviceInfo.serviceID}
        />
      )}
    </div>
  );
}

export default ServicePreview;

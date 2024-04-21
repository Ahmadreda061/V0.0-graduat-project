import { useEffect, useRef, useState } from "react";
import "../style/components-style/servicePreview.css";
import Loading from "./Loding";
function ServicePreview() {
  const [mainImageIndex, setMainImage] = useState(0);
  const [serviceInfo, setServiceInfo] = useState({});
  if (!serviceInfo) {
    return <Loading />;
  }
  useEffect(() => {
    const serviceData = localStorage.getItem("serviceData");
    if (serviceData) {
      setServiceInfo(JSON.parse(serviceData));
    }
  }, []);

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
    if (index != mainImageIndex) {
      setMainImage(index);
    }
  }

  let images = [];
  if (serviceInfo["images"]) {
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
  return (
    <div className="container">
      <div className="service-preview">
        <div className="service-preview--images">
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
          <h1 className="preview--info--title title">{serviceInfo["title"]}</h1>
          <p className="preview--info--description description ">
            {serviceInfo["description"]}
          </p>
          <span className="preview--info--price">${serviceInfo["price"]}</span>
          <button className="btn preview--info--req">Request</button>
        </div>
      </div>
    </div>
  );
}

export default ServicePreview;

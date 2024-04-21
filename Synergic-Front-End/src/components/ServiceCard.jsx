function ServiceCard({ title, price, images, description }) {
  const serviceData = { title, price, images, description };

  function handleClick() {
    localStorage.setItem("serviceData", JSON.stringify(serviceData));
    window.location.href = `/servicepreview`;
  }

  return (
    <div className="service-card myprofile-card " onClick={handleClick}>
      <div className="serivce--main-image">
        <img src={`data:image/png;base64,${images[0]}`} alt="Serivce Image" />
      </div>
      <div className="serivce--info">
        <h3 className="title">{title}</h3>
        <span className="serivce--info--price ">{price}$</span>
      </div>
    </div>
  );
}

export default ServiceCard;

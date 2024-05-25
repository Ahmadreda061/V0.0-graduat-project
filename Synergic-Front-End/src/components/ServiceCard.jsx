function ServiceCard(props) {
  function handleClick() {
    localStorage.setItem("serviceData", JSON.stringify(props));
    window.location.href = `/servicepreview`;
  }
  return (
    <div className="service-card fade-in myprofile-card " onClick={handleClick}>
      <div className="serivce--main-image">
        <img
          src={`data:image/png;base64,${props.images[0]}`}
          alt="Serivce Image"
        />
      </div>
      <div className="serivce--info">
        <h3 className="title">{props.title}</h3>
        <span className="serivce--info--price ">{props.price}$</span>
      </div>
    </div>
  );
}

export default ServiceCard;

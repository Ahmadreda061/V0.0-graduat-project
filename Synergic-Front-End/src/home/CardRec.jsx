
function CardRec(props) {
  function handleClick() {
    localStorage.setItem("serviceData", JSON.stringify(props));
    window.location.href = `/servicepreview`;
  }
  return (
    <div className="card">
      <div className="card--image">
        <img
            src={`data:image/png;base64,${props.images[0]}`}
            alt="service image" loading="lazy"
          />
      </div>
      <div className="service--info">
        <h3 className="title info--title">{props.title}</h3>
        <p className="info--description description " >{props.description}</p>
        <button className="btn" onClick={handleClick}>Learn More</button>
      </div>
    </div>
  );
}

export default CardRec;

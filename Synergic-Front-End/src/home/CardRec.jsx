import getImageUrl from "../utils/image-util";

function CardRec(props) {
  return (
    <div className="card">
      <div className="card--image">
        <img src={getImageUrl(props.img)} alt="service image" loading="lazy"/>
      </div>
      <div className="service--info">
        <h3 className="title info--title">{props.title}</h3>
        <p className="info--description description ">{props.description}</p>
        <button className="btn">Learn More</button>
      </div>
    </div>
  );
}

export default CardRec;

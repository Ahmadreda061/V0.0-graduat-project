import giveTime from "../../utils/giveTime";

function Contact(props) {
  const time = giveTime(props.lastMsg?.sendTime);
  return (
    <div
      className={`contact align-center ${props.isActive ? "active" : ""}`}
      onClick={() => props.setActiveRoom(props.roomID)}
    >
      <img
        src={`data:image/png;base64,${props.img}`}
        alt=""
        className="contact-img circle"
      />
      <div className="contact-info">
        <p className="contact-info--username username">{props.name}</p>
        <p className="contact-info--last-msg align-center">
          <span className="contact-info--text">{props.lastMsg?.message}</span>
          <span className="contact-info--time">{time}</span>
        </p>
      </div>
    </div>
  );
}

export default Contact;

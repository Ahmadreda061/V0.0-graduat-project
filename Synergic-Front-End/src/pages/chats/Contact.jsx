import getImageUrl from "../../utils/image-util";

function Contact(props) {
  return (
    <div className="contact align-center">
      <img
        src={getImageUrl("DefaultProfileImage.png")}
        alt=""
        className="contact-img circle"
      />
      <div className="contact-info">
        <p className="contact-info--username username">ahmadreda081</p>
        <p className="contact-info--last-msg align-center">
          <span className="contact-info--text">
            This last msg bet This last msg bet This last msg bet This last msg
            bet
          </span>
          <span className="contact-info--time">23m</span>
        </p>
      </div>
    </div>
  );
}

export default Contact;

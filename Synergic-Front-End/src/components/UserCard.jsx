import "../style/components-style/uesrCard.css";
import Loading from "./Loding";
import DropDown from "./DropDown";
function UserCard(props) {
  if (!props) {
    return <Loading />;
  }
  const { profilePicture, fName, lName, userRating } = props;

  return (
    <div className="user-card">
      <div className={`user--image `}>
        <img src={`data:image/png;base64,${profilePicture}`} alt="User Image" />
        <div className="dropdown">
          <DropDown
            serviceOwnerToken={props.serviceOwnerToken}
            setUserInfo={props.setUserInfo}
          />
        </div>
      </div>

      <p className="user--name">
        <span className="first-name">{fName} </span>
        <span className="last-name">{lName}</span>
      </p>
      <span className="user--rate">⭐⭐⭐⭐</span>
    </div>
  );
}

export default UserCard;

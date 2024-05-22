import axios from "axios";
import "../style/components-style/yesOrNo.css";
function YesOrNo(props) {
  function deleteSerive() {
    axios
      .delete(
        `https://localhost:7200/api/Services/DeleteService?userToken=${props.userToken}&serviceID=${props.serviceID}`
      )
      .then((res) => {
        if (res.data.statusCode === 0) {
          window.location.pathname = "/explore";
        }
      });
  }
  return (
    <div className="overlay" onClick={props.handleYesOrNo}>
      <div className="YesOrNo">
        <div className="yesorno-field" onClick={(e) => e.stopPropagation()}>
          <p>Are you sure you want to delete your service? </p>
          <div className="yesorno-field-btns">
            <button className="btn green" onClick={deleteSerive}>
              Yes
            </button>
            <button className="btn red" onClick={props.handleYesOrNo}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YesOrNo;

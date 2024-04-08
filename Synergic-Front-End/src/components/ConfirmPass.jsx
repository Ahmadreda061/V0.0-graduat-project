import FormElement from "./FormElement";

function ConfirmPass(props) {
  return (
    <div className="confirmpass">
      <div className="overlay" onClick={props.handleConfirmPass}>
        <div
          className="confirmpass--field"
          onClick={(e) => e.stopPropagation()}
        >
          <i
            className="fa-solid fa-xmark"
            onClick={props.handleConfirmPass}
          ></i>
          <FormElement
            change={props.change}
            type="password"
            name="password"
            field="INPUT"
            label="Please Confirm Your Password"
            error={props.error}
            submitted={true}
            value={props.value}
          />
          <button className="btn">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPass;

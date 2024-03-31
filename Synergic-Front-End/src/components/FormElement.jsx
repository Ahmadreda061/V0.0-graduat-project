function FormElement(props) {
  return (
    <div className="form-element">
      <label htmlFor={props.name}>
        {props.label}
        {props.error && props.submitted && (
          <span className="required">{props.error}</span>
        )}
      </label>
      <input
        type={props.type}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={(e) => props.change(e, "INPUT")}
      />
    </div>
  );
}

export default FormElement;

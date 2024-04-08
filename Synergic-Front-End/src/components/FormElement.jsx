function FormElement(props) {
  // console.log(props);
  return (
    <div className="form-element">
      <label htmlFor={props.name}>
        {props.label}
        {props.error && props.submitted && (
          <span className="required">{props.error}</span>
        )}
      </label>
      <input
        type={props.type ? props.type : "text"}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={(e) => props.change(e, props.field)}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
      />
    </div>
  );
}

export default FormElement;

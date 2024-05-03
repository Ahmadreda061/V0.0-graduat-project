function InfoBox(props) {
  // Object.entries convert it to array and each obj nested array [key, {values}]

  const elements = Object.entries(props.values).map(
    ([key, { label, value }], index) => {
      const isReadOnly =
        props.serviceOwnerToken ||
        ["phoneNumber", "gender", "bDate"].includes(key);
      return (
        <div key={index} className="info-box--contant">
          <label htmlFor={key}>
            {label}:
            {props.errors[key] && (
              <span className="required">{props.errors[key]}</span>
            )}
          </label>
          <input
            style={
              props.serviceOwnerToken && {
                border: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "#3f5be3",
                cursor: "auto",
              }
            }
            name={key}
            type="text"
            readOnly={isReadOnly}
            id={key}
            value={value}
            onChange={(e) => props.change(e, "INPUT")}
          />
        </div>
      );
    }
  );

  return (
    <div className="info-box">
      <h4 className="info-box--header">{props.header}</h4>
      {elements}
    </div>
  );
}

export default InfoBox;

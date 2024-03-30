function InfoBox(props) {
  // Object.entries convert it to array and each obj nested array [key, {values}]

  const elements = Object.entries(props.values).map(
    ([key, { label, value }], index) => {
      return (
        <div key={index}>
          <label htmlFor={key}>{label}:</label>
          <input
            name={key}
            type="text"
            readOnly={(key == "email" || key == "gender") && true}
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

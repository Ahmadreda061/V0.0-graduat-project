import { useReducer, useState } from "react";
import handlePassword from "../utils/passError";
import handlePassRepat from "../utils/handlePassRepat";

function Signup() {
  const [submited, setSubmited] = useState("");
  const [passErr, setPassErr] = useState("");
  const [repatErr, setRepatErr] = useState("");
  const initValues = {
    fname: "",
    lname: "",
    userName: "",
    email: "",
    password: "",
    passwordRepat: "",
    phone: "",
    gender: "true",
    bDate: "",
  };

  const reducer = (values, action) => {
    switch (action.type) {
      case "INPUT":
        return {
          ...values,
          [action.field]: action.value,
        };
      case "SELECT":
        return {
          ...values,
          [action.field]: action.value,
        };
    }
  };
  const [values, dispatch] = useReducer(reducer, initValues);

  function change(e) {
    const element = e.target;
    dispatch({
      type: element.tagName,
      field: element.name,
      value: element.value,
    });
  }

  function submit(e) {
    e.preventDefault();
    let isValid = true;
    setSubmited(true);
    // Check if any required fields are empty
    const requiredFields = [
      "fname",
      "lname",
      "userName",
      "email",
      "password",
      "passwordRepat",
      "phone",
      "gender",
      "bDate",
    ];
    const emptyFields = requiredFields.filter((field) => !values[field]);
    if (emptyFields.length > 0) {
      isValid = false;
    }

    // Validate password
    const errorPassMsg = handlePassword(values.password);
    if (errorPassMsg) {
      setPassErr(errorPassMsg);
      isValid = false;
    } else {
      setPassErr("");
    }

    // Validate repeated password
    const errorRepatPassMsg = handlePassRepat(
      values.password,
      values.passwordRepat
    );
    if (errorRepatPassMsg) {
      setRepatErr(errorRepatPassMsg);
      isValid = false;
    } else {
      setRepatErr("");
    }

    if (isValid) {
      console.log(values);
    }
  }

  return (
    <form className="signup" onSubmit={submit}>
      <div className="input-togthor ">
        <div>
          <label htmlFor="fname">
            First name
            {values.fname === "" && submited && (
              <span className="required">*Required</span>
            )}
          </label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={values.fname}
            onChange={change}
          />
        </div>
        <div>
          <label htmlFor="lname">
            Last name
            {values.lname === "" && submited && (
              <span className="required">*Required</span>
            )}
          </label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={values.lname}
            onChange={change}
          />
        </div>
      </div>

      <label htmlFor="userName">
        User Name
        {values.userName === "" && submited && (
          <span className="required">*Required</span>
        )}
      </label>
      <input
        type="userName"
        id="userName"
        name="userName"
        value={values.userName}
        onChange={change}
      />

      <label htmlFor="email">
        Email
        {values.email === "" && submited && (
          <span className="required">*Required</span>
        )}
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={values.email}
        onChange={change}
      />

      <label htmlFor="password">
        Password
        {passErr && submited && <span className="required">*{passErr}</span>}
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={values.password}
        onChange={change}
      />

      <label htmlFor="passwordRepat">
        Repeat Password
        {repatErr && submited && <span className="required">*{repatErr}</span>}
      </label>
      <input
        type="password"
        id="passwordRepat"
        name="passwordRepat"
        value={values.passwordRepat}
        onChange={change}
      />

      <label htmlFor="phone">
        Phone Number
        {values.phone === "" && submited && (
          <span className="required">*Required</span>
        )}
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={values.phone}
        onChange={change}
      />

      <div className="input-togthor ">
        <div>
          <label htmlFor="gender">
            Gender
            {values.gender === "" && submited && (
              <span className="required">*Required</span>
            )}
          </label>
          <select
            name="gender"
            id="gender"
            onChange={change}
            value={values.gender}
          >
            <option value={true}>Male</option>
            <option value={false}>Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="bDate">
            Birth Date
            {values.bDate === "" && submited && (
              <span className="required">*Required</span>
            )}
          </label>
          <input
            type="date"
            name="bDate"
            id="bDate"
            value={values.bDate}
            onChange={change}
          />
        </div>
      </div>
      <button className="btn">Sign Up</button>
    </form>
  );
}

export default Signup;

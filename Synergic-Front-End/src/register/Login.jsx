import axios from "axios";
import { useContext, useReducer, useState } from "react";
import { showRegisterContext } from "../App";

function Login() {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const handeleShowReg = useContext(showRegisterContext); // when log in succussfuly the reg card hidden
  const initValues = {
    email_or_Username: "",
    password: "",
  };

  const reducer = (values, action) => {
    return {
      ...values,
      [action.name]: action.value,
    };
  };

  const [formData, dispatch] = useReducer(reducer, initValues);

  function change(e) {
    const { name, value } = e.target;
    dispatch({ name, value });
    // Clear error message when input changes
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  }

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    const isValid = validateForm();
    if (isValid) {
      axios
        .post("https://localhost:7014/api/UserAuthentication/Login", formData)
        .then((res) => {
          const data = res.data;
          if (data.statusCode === 0) {
            // succussfuly Log in
            localStorage.setItem("account", formData.email_or_Username);
            setTimeout(() => handeleShowReg(), 300);
          } else if (data.statusCode === 6) {
            // The account not found for login
            setErrors((prevErrors) => ({
              ...prevErrors,
              email_or_Username: data.statusMessage,
            }));
          } else if (data.statusCode === 5) {
            // Password_Incorrect
            setErrors((prevErrors) => ({
              ...prevErrors,
              password: data.statusMessage,
            }));
          }
        });
    }
  }

  function validateForm() {
    const requiredFields = ["email_or_Username", "password"];
    const newErrors = {};

    // Validate required fields
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "*Required";
      }
    });
    // Validate password
    const passError =
      formData.password.length < 8 ? "Password must be more than 8 char's" : "";
    if (passError) {
      newErrors.password = passError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  return (
    <form className="login" onSubmit={submit}>
      <input type="hidden" name="hidden" />
      <label htmlFor="email_or_Username">
        Email or Username{" "}
        {errors.email_or_Username && submitted && (
          <span className="required">*{errors.email_or_Username}</span>
        )}
      </label>
      <input
        type="text"
        id="email_or_Username"
        name="email_or_Username"
        placeholder="Email or Username"
        onChange={change}
      />

      <label htmlFor="password">
        Password{" "}
        {errors.password && submitted && (
          <span className="required">*{errors.password}</span>
        )}
      </label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        onChange={change}
      />

      <button className="btn">Log In</button>
    </form>
  );
}

export default Login;

import { useState } from "react";
import axios from "axios";
import useFormReducer from "../utils/useFormReducer";

function Signup({ handeleIsRegistered }) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const initValues = {
    email: "",
    username: "",
    password: "",
    fName: "",
    lName: "",
    gender: "true",
    bDate: "",
    phoneNumber: "",
    passwordRepat: "",
  };
  const { formData, change } = useFormReducer(initValues, setErrors);
  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    const isValid = validateForm();
    if (isValid) {
      const { passwordRepat, ...postData } = formData; // remove passwordRepat from the post data
      postData.gender = JSON.parse(formData.gender); // parse gender to boolean
      axios
        .post(
          "https://localhost:7200/api/UserAuthentication/Register",
          postData
        )
        .then((res) => {
          const data = res.data;
          if (data.statusCode === 0) {
            // succussfuly registered
            setTimeout(() => handeleIsRegistered(), 300);
          } else if (data.statusCode === 2) {
            // userName or email is used
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: data.statusMessage,
              username: data.statusMessage,
            }));
          } else if (data.statusCode === 3) {
            // Incorect email form
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: data.statusMessage,
            }));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function validateForm() {
    const requiredFields = [
      "fName",
      "lName",
      "username",
      "email",
      "password",
      "passwordRepat",
      "phoneNumber",
      "gender",
      "bDate",
    ];
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

    // Validate repeated password
    const repatError =
      formData.password !== formData.passwordRepat
        ? "Not the same password"
        : "";
    if (repatError) {
      newErrors.passwordRepat = repatError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return (
    <form className="signup" onSubmit={submit}>
      <input type="hidden" name="hidden" />
      <div className="input-togthor ">
        <div>
          <label htmlFor="fName">
            First name
            {errors.fName && submitted && (
              <span className="required">{errors.fName}</span>
            )}
          </label>

          <input
            type="text"
            id="fName"
            name="fName"
            value={formData.fName}
            onChange={(e) => change(e, "INPUT")}
          />
        </div>
        <div>
          <label htmlFor="lName">
            Last name
            {errors.lName && submitted && (
              <span className="required">{errors.lName}</span>
            )}
          </label>
          <input
            type="text"
            id="lName"
            name="lName"
            value={formData.lName}
            onChange={(e) => change(e, "INPUT")}
          />
        </div>
      </div>

      <label htmlFor="username">
        User Name
        {errors.username && submitted && (
          <span className="required">{errors.username}</span>
        )}
      </label>
      <input
        type="username"
        id="username"
        name="username"
        value={formData.username}
        onChange={(e) => change(e, "INPUT")}
      />

      <label htmlFor="email">
        Email
        {errors.email && submitted && (
          <span className="required">{errors.email}</span>
        )}
      </label>
      <input
        type="text"
        id="email"
        name="email"
        value={formData.email}
        onChange={(e) => change(e, "INPUT")}
      />

      <label htmlFor="password">
        Password
        {errors.password && submitted && (
          <span className="required">{errors.password}</span>
        )}
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={(e) => change(e, "INPUT")}
      />

      <label htmlFor="passwordRepat">
        Repeat Password
        {errors.passwordRepat && submitted && (
          <span className="required">{errors.passwordRepat}</span>
        )}
      </label>
      <input
        type="password"
        id="passwordRepat"
        name="passwordRepat"
        value={formData.passwordRepat}
        onChange={(e) => change(e, "INPUT")}
      />

      <label htmlFor="phoneNumber">
        Phone Number
        {errors.phoneNumber && submitted && (
          <span className="required">{errors.phoneNumber}</span>
        )}
      </label>
      <input
        type="tel"
        id="phoneNumber"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={(e) => change(e, "INPUT")}
      />

      <div className="input-togthor ">
        <div>
          <label htmlFor="gender">
            Gender
            {errors.gender && submitted && (
              <span className="required">{errors.gender}</span>
            )}
          </label>
          <select
            name="gender"
            id="gender"
            onChange={(e) => change(e, "SELECT")}
            value={formData.gender}
          >
            <option value={true}>Male</option>
            <option value={false}>Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="bDate">
            Birth Date
            {errors.bDate && submitted && (
              <span className="required">{errors.bDate}</span>
            )}
          </label>
          <input
            type="date"
            name="bDate"
            id="bDate"
            value={formData.bDate}
            onChange={(e) => change(e, "INPUT")}
          />
        </div>
      </div>
      <button className="btn">Sign Up</button>
    </form>
  );
}

export default Signup;

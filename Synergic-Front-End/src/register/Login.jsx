import { useState } from "react";
import validateForm from "../utils/validateForm";
import useFormReducer from "../utils/useFormReducer";
import checkLoginDB from "./utils/checkLoginDB";
import createFormElements from "./utils/CreateFormElements";
function Login({ handleRegisterOverlay }) {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formFields = [
    { name: "email_or_Username", type: "text", label: "Email or Username" },
    { name: "password", type: "password", label: "Password" },
  ];

  const initValues = {
    email_or_Username: "",
    password: "",
  };

  const { formData, change } = useFormReducer(initValues, setErrors);
  const FormElements = createFormElements(
    formFields,
    errors,
    change,
    submitted
  );
  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    const isValid = logInValidateForm();
    if (isValid) {
      checkLoginDB(formData, setErrors)
        .then(() => {
          handleRegisterOverlay();
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  }

  function logInValidateForm() {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return (
    <form className="login" onSubmit={submit}>
      <input type="hidden" name="hidden" />
      {FormElements}

      <button className="btn">Log In</button>
    </form>
  );
}

export default Login;

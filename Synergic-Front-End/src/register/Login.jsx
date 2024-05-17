import { useState } from "react";
import validateForm from "../utils/validateForm";
import useFormReducer from "../utils/useFormReducer";
import checkLoginDB from "./utils/checkLoginDB";
import createFormElements from "../components/CreateFormElements";
function Login({ handeleIsRegistered }) {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formFields = [
    {
      name: "email_or_Username",
      type: "text",
      label: "Email or Username",
      field: "INPUT",
    },
    { name: "password", type: "password", label: "Password", field: "INPUT" },
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
          handeleIsRegistered();
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

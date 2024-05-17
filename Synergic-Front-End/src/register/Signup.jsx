import { useState } from "react";
import useFormReducer from "../utils/useFormReducer";
import postUserToDB from "./utils/postUserToDB";
import validateForm from "../utils/validateForm";
import createFormElements from "../components/CreateFormElements";
import arrayToObj from "../utils/ArraytoObj";
import FormElement from "../components/FormElement";
function Signup({ handeleIsRegistered }) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const formFields = [
    { name: "fName", type: "text", label: "First Name", field: "INPUT" },
    { name: "lName", type: "text", label: "Last Name", field: "INPUT" },
    { name: "username", type: "text", label: "Username", field: "INPUT" },
    { name: "email", type: "text", label: "Email", field: "INPUT" },
    { name: "password", type: "password", label: "Password", field: "INPUT" },
    {
      name: "passwordRepat",
      type: "password",
      label: "Repeat Password",
      field: "INPUT",
    },
    { name: "phoneNumber", type: "tel", label: "Phone Number", field: "INPUT" },
  ];

  const initValuesObject = arrayToObj(formFields, "name");
  const { formData, change } = useFormReducer(
    { ...initValuesObject, gender: "true", bDate: "" },
    setErrors
  );
  const FormElements = createFormElements(
    formFields,
    errors,
    change,
    submitted
  );

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    const isValid = signUpValidateForm();
    if (isValid) {
      const { passwordRepat, ...postData } = formData; // remove passwordRepat from the post data
      postData.gender = JSON.parse(formData.gender); // parse gender to boolean
      postUserToDB(postData, setErrors) // The postUser Return proimse so if it passed go to log in view
        .then(() => handeleIsRegistered())
        .catch((err) => console.log(err));
    }
  }

  function signUpValidateForm() {
    const newErrors = { ...validateForm(formData) };

    // Validate repeated password
    const repatError =
      formData.password !== formData.passwordRepat
        ? "Not the same password"
        : "";
    if (repatError) newErrors.passwordRepat = repatError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return (
    <form className="signup" onSubmit={submit}>
      <input type="hidden" name="hidden" />
      {FormElements}

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
        <FormElement
          name="bDate"
          label="Birth Date"
          error={errors.bDate}
          submitted={submitted}
          type="date"
          change={change}
          value={formData.bDate}
          field="INPUT"
        />
      </div>
      <button className="btn">Sign Up</button>
    </form>
  );
}

export default Signup;

import { useContext, useState } from "react";
import useFormReducer from "../utils/useFormReducer";
import arrayToObj from "../utils/ArraytoObj";
import createFormElements from "../components/CreateFormElements";
import checkImage from "../utils/chaekImage";
import "../style/serviceCreation-style/serviceCreation.css";
import fileToBase from "../utils/fleToBase";
import validateForm from "../utils/validateForm";
import axios from "axios";
import { userInfoContext } from "../App";
import ConfirmPass from "../components/ConfirmPass";
function ServiceCreation() {
  const { userInfo } = useContext(userInfoContext);
  const { userToken, username } = userInfo;
  const [cofirmPassword, setCofirmPassword] = useState(false);

  function handleConfirmPass() {
    setCofirmPassword((prevState) => !prevState);
    return cofirmPassword;
  }

  const [images, setImages] = useState([]);
  const formFields = [
    { name: "title", type: "text", label: "Title", field: "INPUT" },
    { name: "price", type: "number", label: "Price", field: "number" },
  ];
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const initValues = arrayToObj(formFields, "name");
  const { formData, change } = useFormReducer(
    { ...initValues, category: "1", description: "", password: "" },
    setErrors,
    null
  );

  formData.images = images; // to chane the field images to images array after set it
  const FormElements = createFormElements(
    formFields,
    errors,
    change,
    submitted
  );

  async function addImage(e) {
    const { file, isValidExtension } = checkImage(e);
    if (file && isValidExtension) {
      const imgBase64 = await fileToBase(file).then((res) => res);
      setImages((prevImages) => [...prevImages, imgBase64]);
    } else {
      alert("Please select a valid image file (PNG, JPEG, etc.)");
    }
    e.target.value = null;
  }

  function removeImage(indexToRemove) {
    setImages((prevImages) =>
      prevImages.filter((image, index) => index !== indexToRemove)
    );
  }

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    const isValid = creactionValidateForm();
    if (isValid) {
      setCofirmPassword(true);
      if (formData.password) {
        // if there is data in the password post it
        axios
          .post("https://localhost:7200/api/Services/AddService", {
            user: { userToken, username, password: formData.password },
            ...formData,
          })
          .then((res) => {
            alert("Post has been uploded"); // create custom alert
            window.location.pathname = "/myprofile/services";
          });
      }
    }
  }
  function creactionValidateForm() {
    const newErrors = { ...validateForm(formData, false) };
    if (images.length === 0) {
      newErrors["images"] = "*Required";
    }

    if (formData.description.length < 200) {
      newErrors["description"] =
        "*The Description Length Must Be More Than 200 Characters";
    }

    if (formData.title.split(" ").length > 3) {
      newErrors["title"] = "*Title Too Long";
    }

    setErrors(newErrors);
    return (
      Object.keys(newErrors).length === 0 || Object.keys(newErrors).length === 1
    );
  }
  return (
    <div className="service-creation">
      <div className="container">
        <form action="" className="creation-form" onSubmit={submit}>
          <div className="creation-form--info">
            <div className="creation-info--row1">
              {FormElements}

              <div className="form-element">
                <label htmlFor="category">Categories</label>

                <select
                  name="category"
                  id="category"
                  onChange={(e) => change(e, "SELECT")}
                >
                  <option value="1">dummy1</option>
                  <option value="2">dummy2</option>
                  <option value="3">dummy3</option>
                  <option value="4">dummy4</option>
                  <option value="5">dummy5</option>
                </select>
              </div>
            </div>
            <div className="creation-info--row2">
              <label htmlFor="description">
                Description
                {errors.description && submitted && (
                  <span className="required">{errors.description}</span>
                )}
              </label>
              <textarea
                onChange={(e) => change(e, "INPUT")}
                name="description"
                id="description"
                placeholder="Enter Your Description..."
                // maxLength="600"
              ></textarea>
            </div>
            <button className="btn">Add Service</button>
          </div>
          <div className="creation-form--images">
            <div className="form-element">
              {errors.images && submitted && (
                <span className="required">{errors.images}</span>
              )}
              <label htmlFor="images">
                Select Images
                <i
                  className="fa-solid fa-camera"
                  style={{ fontSize: "1.6rem" }}
                ></i>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={addImage}
                />
              </label>
            </div>

            <div className="images-preview">
              {images.map((image, index) => (
                <div key={index} className="images-preview--image">
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => removeImage(index)}
                  ></i>
                  <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt={`Service image ${index}`}
                  ></img>
                </div>
              ))}
            </div>
          </div>
          {cofirmPassword && (
            <ConfirmPass
              value={formData.password}
              change={change}
              error={errors.password}
              cofirmPassword={cofirmPassword}
              handleConfirmPass={handleConfirmPass}
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default ServiceCreation;

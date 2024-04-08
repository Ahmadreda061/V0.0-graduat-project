import React, { useContext, useState } from "react";
import { userInfoContext } from "../../App";
import UserCard from "../../components/UserCard";
import InfoBox from "../../components/InfoBox";
import useFormReducer from "../../utils/useFormReducer";
import validateForm from "../../utils/validateForm";
import isAllAlphabetic from "../../utils/isAllAlphabetic";
import isValidUsername from "../../utils/isValidUsername";
import setProfile from "./utils/setProfile";

function Information() {
  const { userInfo } = useContext(userInfoContext);
  const [errors, setErrors] = useState({});
  const [editedFileds, setEditedFileds] = useState({});
  const { formData, change } = useFormReducer(
    { ...userInfo },
    setErrors,
    setEditedFileds
  );

  function submit(e) {
    e.preventDefault();
    const isValid = editInfoValidateForm();
    if (isValid || userInfo.profilePicture != formData.profilePicture) {
      // change userInfo.profilePicture direct and formData.profilePicture will never change so there can we now if the pic edit or not
      const postData = {
        userToken: userInfo.userToken,
        ...editedFileds,
        profilePicture: userInfo.profilePicture,
      };
      setProfile(postData, setErrors);
    }
  }

  function editInfoValidateForm() {
    if (Object.keys(editedFileds).length > 0) {
      const newErrors = { ...validateForm(formData, false) };

      // check if the first name is only Alphabetic...
      if (!isAllAlphabetic(formData.fName)) {
        newErrors["fName"] = "*must have Alphabetic only";
      }

      // check if the last name is only Alphabetic...
      if (!isAllAlphabetic(formData.lName)) {
        newErrors["lName"] = "*must have Alphabetic only";
      }
      // check if the username have correct format
      if (!isValidUsername(formData.username)) {
        newErrors["username"] = "*Expcted Alphabetic, Nums and _ only";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return false;
  }

  return (
    <>
      <form className="informations" onSubmit={submit}>
        <div className="informations--avatar">
          <UserCard />
        </div>
        <div className="informations--sections">
          <InfoBox
            header="General Information"
            errors={errors}
            change={change}
            values={{
              fName: { label: "First Name", value: formData.fName },
              lName: { label: "Last Name", value: formData.lName },
              username: { label: "Username", value: formData.username },
            }}
          />

          <InfoBox
            header="Personal Information"
            errors={errors}
            change={change}
            values={{
              email: { label: "Email", value: formData.email },
              phoneNumber: {
                label: "Phone Number",
                value: formData.phoneNumber,
              },
              gender: {
                label: "Gender",
                value: formData.gender ? "Male" : "Female",
              },
              bDate: { label: "Birth Date", value: formData.bDate },
            }}
          />
          <InfoBox
            header="Social Media Accounts"
            errors={errors}
            change={change}
            values={{
              insta: { label: "insta", value: formData.insta },
              facebook: { label: "facebook", value: formData.facebook },
              linkedIn: { label: "linkedIn", value: formData.linkedIn },
            }}
          />
          <div className="info-box" style={{ flexDirection: "column" }}>
            <label
              htmlFor="userBio"
              style={{ fontSize: "1.2rem", color: "inherit" }}
            >
              Bio
            </label>
            <textarea
              id="userBio"
              name="userBio"
              placeholder="Enter your bio..."
              onChange={(e) => change(e, "INPUT")}
              value={formData.userBio}
            ></textarea>
          </div>
          <button
            className="btn informations--confirm"
            style={{ margin: "20px" }}
          >
            Confirm Changes
          </button>
        </div>
      </form>
    </>
  );
}

export default Information;

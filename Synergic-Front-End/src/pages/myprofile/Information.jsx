import React, { useContext, useEffect, useState } from "react";
import { userInfoContext } from "../../App";
import UserCard from "../../components/UserCard";
import InfoBox from "../../components/InfoBox";
import useFormReducer from "../../utils/useFormReducer";
import validateForm from "../../utils/validateForm";
import isAllAlphabetic from "../../utils/isAllAlphabetic";
import isValidUsername from "../../utils/isValidUsername";
import setProfile from "./utils/setProfile";
import { UserTokenContext } from "./Myprofile";
import getUserNotfications from "../../utils/getUserNotfications";

function Information() {
  const serviceOwnerInfo = useContext(UserTokenContext);
  const { userInfo, setUserInfo } = useContext(userInfoContext);
  const [serviceOwnerToken, setServiceOwnerToken] = useState(null);
  getUserNotfications(userInfo.userToken);
  const [errors, setErrors] = useState({});
  const [editedFields, setEditedFields] = useState({});
  const { formData, change } = useFormReducer(
    { ...userInfo },
    setErrors,
    setEditedFields
  );
  function submit(e) {
    if (e) {
      e.preventDefault();
    }
    const isValid = editInfoValidateForm();
    if (isValid || userInfo.profilePicture !== formData.profilePicture) {
      const postData = {
        userToken: userInfo.userToken,
        ...editedFields,
        profilePicture: userInfo.profilePicture,
      };

      setProfile(postData, setErrors);
    }
  }
  function editInfoValidateForm() {
    if (Object.keys(editedFields).length > 0) {
      const {
        serviceOwnerToken,
        socialAccounts,
        userBio,
        isVendor,
        userRating,
        ...ReqData
      } = formData;
      const newErrors = { ...validateForm(ReqData, false) };

      if (!isAllAlphabetic(formData.fName)) {
        newErrors["fName"] = "* Must have alphabetic characters only";
      }

      if (!isAllAlphabetic(formData.lName)) {
        newErrors["lName"] = "* Must have alphabetic characters only";
      }

      if (!isValidUsername(formData.username)) {
        newErrors["username"] =
          "* Expected alphabetic characters, numbers, and underscores only";
      }

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    }
    return false;
  }

  useEffect(() => {
    if (serviceOwnerInfo != null) {
      setServiceOwnerToken(serviceOwnerInfo.userToken);
      Object.keys(serviceOwnerInfo).forEach((key) => {
        change(
          { target: { name: key, value: serviceOwnerInfo[key] } },
          "INPUT"
        );
      });
    }
  }, [serviceOwnerInfo]);

  return (
    <>
      <form onSubmit={submit} className="informations">
        <div className="informations--avatar">
          <UserCard
            serviceOwnerToken={serviceOwnerToken}
            profilePicture={
              // make the page of service owner using formData...
              serviceOwnerToken
                ? formData.profilePicture
                : userInfo.profilePicture
            }
            fName={formData.fName}
            lName={formData.lName}
            // userRating={userInfo.userRating}
            setUserInfo={setUserInfo}
            username={formData.username}
          />
        </div>
        <div className="informations--sections">
          <InfoBox
            serviceOwnerToken={serviceOwnerToken}
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
            serviceOwnerToken={serviceOwnerToken}
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
            serviceOwnerToken={serviceOwnerToken}
            header="Social Media Accounts"
            errors={errors}
            change={change}
            values={{
              insta: { label: "Instagram", value: formData.insta },
              facebook: { label: "Facebook", value: formData.facebook },
              linkedIn: { label: "LinkedIn", value: formData.linkedIn },
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
              style={
                serviceOwnerToken && {
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "#3f5be3",
                  cursor: "auto",
                }
              }
              readOnly={serviceOwnerToken && true}
              id="userBio"
              name="userBio"
              placeholder={serviceOwnerToken ? "No Bio" : "Enter Your Bio..."}
              onChange={(e) => change(e, "INPUT")}
              value={formData.userBio}
            ></textarea>
          </div>
          {!serviceOwnerToken && (
            <button
              className="btn informations--confirm"
              style={{ margin: "20px" }}
            >
              Confirm Changes
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default Information;

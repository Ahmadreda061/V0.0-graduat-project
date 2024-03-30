import React, { useContext, useState } from "react";
import { userInfoContext } from "../../App";
import UserCard from "../../components/UserCard";
import InfoBox from "../../components/InfoBox";
import useFormReducer from "../../utils/useFormReducer";
function Information() {
  const userInfo = useContext(userInfoContext);
  const [errors, setErrors] = useState({});

  const { formData, change } = useFormReducer(
    { ...userInfo, insta: "", facebook: "", linkedIn: "", bio: "" },
    setErrors
  );

  function submit(e) {
    e.preventDefault();
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
            change={change}
            values={{
              fName: { label: "First Name", value: formData.fName },
              lName: { label: "Last Name", value: formData.lName },
              username: { label: "Username", value: formData.username },
            }}
          />
          <InfoBox
            header="Personal Information"
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
            change={change}
            values={{
              insta: { label: "insta", value: formData.insta },
              facebook: { label: "facebook", value: formData.facebook },
              linkedIn: { label: "linkedIn", value: formData.linkedIn },
            }}
          />
          {/* Bio Section */}
          <div className="info-box">
            <h4 className="info-box--header">Bio</h4>
            <textarea
              style={{ maxHeight: "200px", maxWidth: "400px", padding: "5px" }}
              rows="4"
              cols="50"
              placeholder="Enter your bio..."
              onChange={(e) => change(e, "INPUT")}
              value={formData.bio}
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

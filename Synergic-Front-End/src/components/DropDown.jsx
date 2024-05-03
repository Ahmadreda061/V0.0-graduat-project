import React, { useRef, useState } from "react";
import "../style/components-style/drop-down.css";
import fileToBase from "../utils/fleToBase";
import checkImage from "../utils/chaekImage";
function DropDown({ setUserInfo, serviceOwnerToken }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileRef = useRef(null);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  const handleUploadImage = () => {
    fileRef.current.click();
  };

  const handleFileChange = async (e) => {
    const { file, isValidExtension } = checkImage(e);

    if (file && isValidExtension) {
      const imgBase64 = await fileToBase(file).then((res) => res);
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        profilePicture: imgBase64,
      }));
    } else {
      alert("Please select a valid image file (PNG, JPEG, etc.)");
    }
  };
  return (
    <div>
      {!serviceOwnerToken && (
        <button className="dropbtn" type="button" onClick={toggleDropdown}>
          <i
            className="fa-regular fa-pen-to-square"
            style={{ marginRight: "5px" }}
          ></i>
          Edit
        </button>
      )}
      {isDropdownOpen && (
        <div className="dropdown-content">
          <a href="#" onClick={handleUploadImage}>
            <input
              type="file"
              ref={fileRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            Upload Image
          </a>
        </div>
      )}
    </div>
  );
}

export default DropDown;

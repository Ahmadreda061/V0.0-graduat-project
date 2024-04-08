import React, { useRef, useState } from "react";
import "../style/components-style/drop-down.css";
import fileToBase from "../utils/fleToBase";
function DropDown({ setUserInfo }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileRef = useRef(null);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };
  const handleUploadImage = () => {
    fileRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const validExtensions = [".png", ".jpg", ".jpeg"];

    const isValidExtension = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

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
      <button className="dropbtn" type="button" onClick={toggleDropdown}>
        <i
          className="fa-regular fa-pen-to-square"
          style={{ marginRight: "5px" }}
        ></i>
        Edit
      </button>
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

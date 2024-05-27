import React from "react";
import Acttive from "./myprofile-component/Acttive";
import "../../style/myprofile-style/actives.css";
function Actives() {
  return (
    <div className="myprofile-cards actives-cards">
      <Acttive msg="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum!" />
      <Acttive msg="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum!" />
      <Acttive msg="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum!" />
    </div>
  );
}

export default Actives;

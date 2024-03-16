import { Link } from "react-router-dom";
import "../style/register-style/register.css";
import getImageUrl from "../utils/image-util";
import Login from "./Login";
import Signup from "./Signup";
import { useContext, useState } from "react";
import { showRegisterContext } from "../App";

function Register() {
  const [isLogin, setIsLogin] = useState(false);
  const handeleShowReg = useContext(showRegisterContext);

  function hanldeCardClick(e) {
    /*  the card inside the overlay so when clicked the card like we clicked the overlay so 
        you prevent the event from propagating to parent elements*/
    e.stopPropagation();
  }
  return (
    <div className="register">
      <div className="overlay" onClick={handeleShowReg}>
        <div
          className={`register--card ${!isLogin && "signup"}`}
          onClick={hanldeCardClick}
        >
          <div className="register-image">
            <img src={getImageUrl("register-img.jfif")} alt="register image" />
          </div>
          <div className={`register-form ${!isLogin ? "signup" : ""}`}>
            <i className="fa-solid fa-xmark" onClick={handeleShowReg}></i>
            <h3 className="title form-title">
              {isLogin ? "Log in" : "Sign Up"}
            </h3>
            {isLogin && (
              <p className="description form-welcome">
                Welcome to Synergic Log in
              </p>
            )}

            {isLogin ? <Login /> : <Signup />}
            <Link
              onClick={() => setIsLogin((prevIsReg) => !prevIsReg)}
              style={{ fontSize: "14px" }}
            >
              {isLogin ? "Create New Account" : "Login Now"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

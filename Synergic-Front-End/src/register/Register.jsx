import { Link } from "react-router-dom";
import "../style/register-style/register.css";
import getImageUrl from "../utils/image-util";
import Login from "./Login";
import Signup from "./Signup";
import { useState } from "react";

function Register({ handleRegisterOverlay }) {
  const [isRegistered, setIsRegistered] = useState(false);
  function handeleIsRegistered() {
    /*
     if click in log in link make isReg to true and go to log in view else if click in sign up link so registerd and go to sign up view 
     otherwise if finshed sign up seccussfuly  make isReg to true and go to log in view
    */
    setIsRegistered((prevIsReg) => !prevIsReg);
  }

  return (
    <div className="register">
      <div className="overlay" onClick={handleRegisterOverlay}>
        <div
          className={`register--card ${!isRegistered && "signup"}`}
          onClick={(e) =>
            e.stopPropagation()
          } /*  the card inside the overlay so when clicked the card like we clicked the overlay so 
          you prevent the event from propagating to parent elements*/
        >
          <div className="register-image">
            <img src={getImageUrl("register-img.jfif")} alt="register image" />
          </div>
          <div
            className={`register-form ${!isRegistered ? "signup" : "login"}`}
          >
            <i
              className="fa-solid fa-xmark"
              onClick={handleRegisterOverlay}
            ></i>
            <h3 className="title form-title">
              {isRegistered ? "Log in" : "Sign Up"}
            </h3>
            {isRegistered && (
              <p className="description form-welcome">
                Welcome to Synergic Log in
              </p>
            )}

            {isRegistered ? (
              <Login handleRegisterOverlay={handleRegisterOverlay} />
            ) : (
              <Signup handeleIsRegistered={handeleIsRegistered} />
            )}
            <Link onClick={handeleIsRegistered} style={{ fontSize: "14px" }}>
              {isRegistered ? "Create New Account" : "Login Now"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

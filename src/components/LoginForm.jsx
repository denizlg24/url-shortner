import { useState } from "react";
import "./RegisterForm.css";
import viewPass from "../assets/icons8-view-64.png";
import hidePass from "../assets/icons8-hide-64.png";
import ErrorModal from "./ErrorModal";
import Services from "../services/Services";

const LoginForm = (props) => {
  const [errorState, displayErrorModal] = useState([]);


  const resetPasswordHandler = (e) => {
    e.preventDefault();
    props.startPasswordResetFlow();
  }


  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });

  const usernameUpdateHandler = (event) => {
    setUserInput((prevInput) => {
      return {
        ...prevInput,
        username: event.target.value,
      };
    });
  };

  const passwordUpdateHandler = (event) => {
    setUserInput((prevInput) => {
      return {
        ...prevInput,
        password: event.target.value,
      };
    });
  };

  const cancelError = (e) =>{
    e.preventDefault();
    displayErrorModal([]);
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await Services.loginUser({
      emailOrUsername:userInput.username,
      password:userInput.password, 
    });
    if (response.response === "ok") {
      const accessToken = response.accessToken;
      localStorage.setItem("accessToken",accessToken);
      props.loginSuccessHandler();
    } else {
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
    }
  };

  const [showingPassword, setShowing] = useState(false);
  const passwordShowHandler = (e) => {
    e.preventDefault();
    setShowing((prevState) => {
      return !prevState;
    });
  };

  return (
    <>
      {errorState}
      <form onSubmit={handleLogin}>
        <h1 className="register-form-title">Login</h1>
        <div className="register-form__inputs">
          <input
            autoComplete="off"
            type="text"
            id="username"
            placeholder="Your email"
            onChange={usernameUpdateHandler}
          ></input>
          <label
            className="error-label-register"
            htmlFor="username"
            style={{ display: false ? "" : "none" }}
          ></label>
          <div className="password-field">
            <input
              autoComplete="off"
              type={showingPassword ? "text" : "password"}
              id="password"
              placeholder="Your password"
              onChange={passwordUpdateHandler}
            ></input>
            <button
              className="show-password-button"
              onClick={passwordShowHandler}
            >
              <img src={!showingPassword ? viewPass : hidePass}></img>
            </button>
          </div>
          <label
            className="error-label-register"
            htmlFor="password"
            style={{ display: false ? "" : "none" }}
          ></label>
          
          <button
            type="submit"
            id="loginAccount"
            className="submit-button-register"
          >
            Log In
          </button>
          <button type="button" className="reset-pass-login-btn" onClick={resetPasswordHandler}><p>Forgot password?</p></button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;

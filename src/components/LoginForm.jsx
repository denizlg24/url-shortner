import { useEffect, useState } from "react";
import "./RegisterForm.css";
import auth from "../services/auth";
import viewPass from "../assets/icons8-view-64.png";
import hidePass from "../assets/icons8-hide-64.png";

const LoginForm = (props) => {
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

  const handleLogin = (event) => {
    event.preventDefault();
    auth.client.login(
      {
        realm: "Username-Password-Authentication",
        username: userInput.username,
        password: userInput.password,
      },
      (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          localStorage.setItem("accessToken", authResult.accessToken);
          localStorage.setItem("idToken", authResult.idToken);
          // Redirect the user to the home page
          props.loginSuccessHandler();
        } else if (err) {
          console.log(err);
        }
      }
    );
  };

  const [showingPassword, setShowing] = useState(false);
  const passwordShowHandler = (e) => {
    e.preventDefault();
    setShowing((prevState) => {
      return !prevState;
    });
  };

  return (
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
      </div>
    </form>
  );
};

export default LoginForm;

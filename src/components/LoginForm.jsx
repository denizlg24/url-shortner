import { useEffect, useState } from "react";
import "./RegisterForm.css";
import auth from "../services/auth";

const LoginForm = (props) => {
  const [userInput, setUserInput] = useState({
    username: "",
    password: "",
  });

  const usernameUpdateHandler = (event) => {
    console.log(userInput.username);
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
    console.log(userInput);
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

  return (
    <form onSubmit={handleLogin}>
      <h1 className="register-form-title">Login</h1>
      <div className="register-form__inputs">
        <input
          autoComplete="off"
          type="text"
          id="username"
          placeholder="Username or email"
          onChange={usernameUpdateHandler}
        ></input>
        <label
          className="error-label-register"
          htmlFor="username"
          style={{ display: false ? "" : "none" }}
        ></label>
        <input
          autoComplete="off"
          type="password"
          id="password"
          placeholder="Your password"
          onChange={passwordUpdateHandler}
        ></input>
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

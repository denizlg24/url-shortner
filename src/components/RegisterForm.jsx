import { useEffect, useState } from "react";
import "./RegisterForm.css";
import viewPass from "../assets/icons8-view-64.png";
import hidePass from "../assets/icons8-hide-64.png";
import Services from "../services/Services";
import ErrorModal from "./ErrorModal";

const RegisterForm = (props) => {
  const [errorModalState, displayErrorModal] = useState([]);

  const [userInput, setUserInput] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [errorState, setErrorState] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [focusState, setFocusState] = useState({
    username: false,
    displayName: false,
    email: false,
    password: false,
  });

  const checkUserInputValidaty = (inputToCheck, isForced) => {
    const { username, email, password, repeatPassword } = inputToCheck;
    const displayNameError = () => {
      if (!focusState.displayName && !isForced) {
        return "";
      }
      if (username.trim().length === 0) {
        return "Display name cannot be empty.";
      }
      var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (format.test(username)) {
        return "Display name cannot contain special characters.";
      }
      return "";
    };
    const usernameError = () => {
      if (!focusState.username && !isForced) {
        return "";
      }
      if (username.trim().length === 0) {
        return "Username cannot be empty.";
      }
      if (username.trim().length > 32) {
        return "Username cannot be more than 32 characters long.";
      }
      var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if (format.test(username)) {
        return "Username cannot contain spaces or special characters.";
      }
      return "";
    };
    const emailError = () => {
      if (!focusState.email && !isForced) {
        return "";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Email is not valid.";
      }
      return "";
    };
    const passwordError = () => {
      if (!focusState.password && !isForced) {
        return "";
      }
      var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
      if (password.trim().length < 8 || !password.trim().match(paswd)) {
        return "Password must be 7-15 characters & contain at least 1 digit & 1 special character";
      }
      return "";
    };
    const repeatError = () => {
      if (
        !errorState.password &&
        password.trim().length >= 8 &&
        password != repeatPassword
      ) {
        return "The passwords do not match.";
      }
      return "";
    };
    setErrorState({
      displayName: displayNameError(),
      username: usernameError(),
      email: emailError(),
      password: passwordError(),
      repeatPassword: repeatError(),
    });
    return {
      displayName: displayNameError(),
      username: usernameError(),
      email: emailError(),
      password: passwordError(),
      repeatPassword: repeatError(),
    };
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      checkUserInputValidaty(userInput, false);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [userInput]);

  const usernameUpdateHandler = (event) => {
    setUserInput((prevInput) => {
      return {
        ...prevInput,
        username: event.target.value,
      };
    });
  };

  const displayNameUpdateHandler = (event) => {
    setUserInput((prevInput) => {
      return {
        ...prevInput,
        displayName: event.target.value,
      };
    });
  };

  const emailUpdateHandler = (event) => {
    setUserInput((prevInput) => {
      return {
        ...prevInput,
        email: event.target.value,
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
  const repeatUpdateHandler = (event) => {
    setUserInput((prevInput) => {
      return {
        ...prevInput,
        repeatPassword: event.target.value,
      };
    });
  };

  const usernameFocusHandler = () => {
    setFocusState((prevState) => {
      return {
        ...prevState,
        username: true,
      };
    });
  };
  const displayNameFocusHandler = () => {
    setFocusState((prevState) => {
      return {
        ...prevState,
        displayName: true,
      };
    });
  };
  const emailFocusHandler = () => {
    setFocusState((prevState) => {
      return {
        ...prevState,
        email: true,
      };
    });
  };
  const passwordFocusHandler = () => {
    setFocusState((prevState) => {
      return {
        ...prevState,
        password: true,
      };
    });
  };

  const cancelError = (e) => {
    displayErrorModal([]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    let currentChecks = checkUserInputValidaty(userInput, true);
    if (
      currentChecks.displayName ||
      currentChecks.username ||
      currentChecks.email ||
      currentChecks.password ||
      currentChecks.repeatPassword
    ) {
      return;
    }
    const response = await Services.registerUser({
      email: userInput.email,
      password: userInput.password,
      username: userInput.username,
      displayName: userInput.displayName,
    });
    if (response.response === "ok") {
      props.registrationSuccess(userInput.email);
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
  const [showingPasswordR, setShowingR] = useState(false);
  const repeatPasswordShowHandler = (e) => {
    e.preventDefault();
    setShowingR((prevState) => {
      return !prevState;
    });
  };
  const passwordShowHandler = (e) => {
    e.preventDefault();
    setShowing((prevState) => {
      return !prevState;
    });
  };
  return (
    <>
      {errorModalState}
      <form onSubmit={submitHandler}>
        <h1 className="register-form-title">Create account</h1>
        <div className="register-form__inputs">
          <input
            autoComplete="off"
            type="text"
            id="displayName"
            placeholder="Display name"
            style={{
              borderColor: !errorState.displayName ? "" : "rgb(250, 107, 107)",
            }}
            onChange={displayNameUpdateHandler}
            onFocus={displayNameFocusHandler}
          ></input>
          <label
            className="error-label-register"
            htmlFor="displayName"
            style={{ display: errorState.displayName ? "" : "none" }}
          >
            {errorState.displayName}
          </label>
          <input
            autoComplete="off"
            type="text"
            id="username"
            placeholder="Username"
            style={{
              borderColor: !errorState.username ? "" : "rgb(250, 107, 107)",
            }}
            onChange={usernameUpdateHandler}
            onFocus={usernameFocusHandler}
          ></input>
          <label
            className="error-label-register"
            htmlFor="username"
            style={{ display: errorState.username ? "" : "none" }}
          >
            {errorState.username}
          </label>
          <input
            autoComplete="off"
            type="text"
            id="email"
            placeholder="Email"
            style={{
              borderColor: !errorState.email ? "" : "rgb(250, 107, 107)",
            }}
            onChange={emailUpdateHandler}
            onFocus={emailFocusHandler}
          ></input>
          <label
            className="error-label-register"
            htmlFor="email"
            style={{ display: errorState.email ? "" : "none" }}
          >
            {errorState.email}
          </label>
          <div className="password-field">
            <input
              autoComplete="off"
              type={showingPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              style={{
                borderColor: !errorState.password ? "" : "rgb(250, 107, 107)",
              }}
              onChange={passwordUpdateHandler}
              onFocus={passwordFocusHandler}
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
            style={{ display: errorState.password ? "" : "none" }}
          >
            {errorState.password}
          </label>
          <div className="password-field">
            <input
              autoComplete="off"
              type={showingPasswordR ? "text" : "password"}
              id="passwordRepeat"
              placeholder="Repeat password"
              style={{
                borderColor: !errorState.repeatPassword
                  ? ""
                  : "rgb(250, 107, 107)",
              }}
              onChange={repeatUpdateHandler}
            ></input>
            <button
              className="show-password-button"
              onClick={repeatPasswordShowHandler}
            >
              <img src={!showingPasswordR ? viewPass : hidePass}></img>
            </button>
          </div>
          <label
            className="error-label-register"
            htmlFor="passwordRepeat"
            style={{ display: errorState.repeatPassword ? "" : "none" }}
          >
            {errorState.repeatPassword}
          </label>
          <button
            type="submit"
            id="createAccount"
            className="submit-button-register"
          >
            Create Account
          </button>
          <label
            className="error-label-register"
            htmlFor="passwordRepeat"
            style={{ display: "none" }}
          >
            Error State
          </label>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;

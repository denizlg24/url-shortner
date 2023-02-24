import { useEffect, useState } from "react";
import "./RegisterForm.css";
import viewPass from "../assets/icons8-view-64.png";
import hidePass from "../assets/icons8-hide-64.png";
import auth from "../services/auth";

const RegisterForm = (props) => {
  const [userInput, setUserInput] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [errorState, setErrorState] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [focusState, setFocusState] = useState({
    username: false,
    email: false,
    password: false,
  });

  const checkUserInputValidaty = (inputToCheck, isForced) => {
    const { username, email, password, repeatPassword } = inputToCheck;
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
      if (!email.includes("@")) {
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
        (!errorState.password && password.trim().length >= 8) &&
        password != repeatPassword
      ) {
        return "The passwords do not match.";
      }
      return "";
    };
    setErrorState({
      username: usernameError(),
      email: emailError(),
      password: passwordError(),
      repeatPassword: repeatError(),
    });
    return {
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

  const submitHandler = (event) => {
    event.preventDefault();
    let currentChecks = checkUserInputValidaty(userInput, true);
    if (
      currentChecks.username ||
      currentChecks.email ||
      currentChecks.password ||
      currentChecks.repeatPassword
    ) {
      return;
    }
    auth.signup(
      {
        connection: "Username-Password-Authentication",
        email: userInput.email,
        password: userInput.password,
        nickname: userInput.username,
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          props.registrationSuccess(userInput.email);
        }
      }
    );
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
    <form onSubmit={submitHandler}>
      <h1 className="register-form-title">Create account</h1>
      <div className="register-form__inputs">
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
          style={{ borderColor: !errorState.email ? "" : "rgb(250, 107, 107)" }}
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
  );
};

export default RegisterForm;

import { useEffect, useState } from "react";
import Card from "../components/Card";
import Services from "../services/Services";
import "./PasswordReset.css";
import ErrorModal from "../components/ErrorModal";
import viewPass from "../assets/icons8-view-64.png";
import hidePass from "../assets/icons8-hide-64.png";

function PasswordReset(props) {
  useEffect(() => {
    if (props.resetToken) {
      changeState((prevState) => {
        return {
          ...prevState,
          displaying: 2,
          input: { resetToken: props.resetToken },
        };
      });
    }
  }, []);

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
  const [errorState, displayErrorModal] = useState([]);
  const [pageState, changeState] = useState({
    displaying: 0,
    input: {
      email: "",
      passwordOne: "",
      passwordTwo: "",
      resetToken: "",
    },
    errorState: {
      email: "",
      passwordOne: "",
      passwordTwo: "",
    },
    focusState: {
      email: false,
      passwordOne: false,
      passwordTwo: false,
    },
  });

  useEffect(() => {
    const identifier = setTimeout(() => {
      checkUserInputValidaty(pageState.input, false);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [pageState.input]);

  const checkUserInputValidaty = (input, forced) => {
    const { email, passwordOne, passwordTwo } = input;
    const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ""
      : "Email is not valid";

    const passwordOneError =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(passwordOne)
        ? ""
        : "Password must be 7-15 characters & contain at least 1 digit & 1 special character";

    const passwordTwoError = !passwordOneError && passwordTwo != passwordOne ? "Passwords must match" : "";

    changeState((prevState) => {
      return {
        ...prevState,
        errorState: {
          email: emailError,
          passwordOne: passwordOneError,
          passwordTwo: passwordTwoError,
        },
      };
    });
  };

  const emailUpdateHandler = (e) => {
    changeState((prevState) => {
      return {
        ...prevState,
        input: { ...prevState.input,email: e.target.value },
      };
    });
  };
  const emailFocusHandler = (e) => {
    changeState((prevState) => {
      return {
        ...prevState,
        focusState: { ...prevState.focusState, email: true },
      };
    });
  };

  const passwordUpdateHandler = (e) => {
    changeState((prevState) => {
      return {
        ...prevState,
        input: { ...prevState.input, passwordOne: e.target.value },
      };
    });
  };
  const repeatUpdateHandler = (e) => {
    changeState((prevState) => {
      return {
        ...prevState,
        input: { ...prevState.input, passwordTwo: e.target.value },
      };
    });
  };

  const passwordFocusHandler = (e) => {
    changeState((prevState) => {
      return {
        ...prevState,
        focusState: { ...prevState.focusState, passwordOne: true },
      };
    });
  };

  const clickResetEmailBtnHandler = async (e) => {
    e.preventDefault();
    if (pageState.errorState.email || !pageState.focusState.email) {
      return;
    }
    const response = await Services.startResetFlow(pageState.input.email);
    if (response.response === "ok") {
      changeState((prevState) => {
        return {
          ...prevState,
          displaying: 1,
          errorState: {
            email: "",
            passwordOne: "",
            passwordTwo: "",
          },
          focusState: {
            email: false,
            passwordOne: false,
            passwordTwo: false,
          },
        };
      });
    } else {
      console.log(response);
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      return;
    }
  };

  const clickChangePasswordHandler = async (e) => {
    e.preventDefault();
    if (
      pageState.errorState.passwordOne ||
      !pageState.focusState.passwordOne ||
      pageState.errorState.passwordTwo
    ) {
      return;
    }
    const response = await Services.syncPasswordChange(
      pageState.input.passwordOne,
      props.resetToken
    );
    if (response.response === "ok") {
      changeState({
        displaying: 3,
        input: {
          email: "",
          passwordOne: "",
          passwordTwo: "",
          resetToken: "",
        },
        errorState: {
          email: "",
          passwordOne: "",
          passwordTwo: "",
        },
        focusState: {
          email: false,
          passwordOne: false,
          passwordTwo: false,
        },
      });
      props.resetTokenReset();
    } else {
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      return;
    }
  };

  const cancelError = (e) => {
    displayErrorModal([]);
  };

  return (
    <>
      {errorState}
      <div className="main-password-reset-holder">
        <div className="main-password-reset-content">
          <Card className="main-password-reset-email-container">
            <div className="verification-content">
              <h1>
                {pageState.displaying === 1 || pageState.displaying === 0
                  ? "Account Recovery"
                  : "Reset Password"}
              </h1>
              {pageState.displaying === 1 && (
                <h2>
                  Head to your email at <span>{pageState.input.email}</span> and
                  verify your account. Allow up to 10 minutes for the recovery
                  email to be sent.
                </h2>
              )}
              {pageState.displaying === 0 && (
                <>
                  <h3 style={{ marginTop: "1rem", textAlign: "center" }}>
                    Enter the email address you use for the account.
                  </h3>
                  <div className="register-form__inputs">
                    <input
                      autoComplete="off"
                      type="text"
                      id="email"
                      placeholder="Email"
                      style={{
                        borderColor: !pageState?.errorState?.email
                          ? ""
                          : "rgb(250, 107, 107)",
                      }}
                      onChange={emailUpdateHandler}
                      onFocus={emailFocusHandler}
                    ></input>
                    <label
                      className="error-label-register"
                      htmlFor="email"
                      style={{
                        display: pageState?.errorState?.email ? "" : "none",
                      }}
                    >
                      {pageState?.errorState?.email}
                    </label>
                  </div>
                  <h3 style={{ marginTop: "1rem", textAlign: "center" }}>
                    If we find a valid email address, we will send an email with
                    a recovery link.
                  </h3>
                  <div className="verification-actions">
                    <h3>Recover Account</h3>
                    <button onClick={clickResetEmailBtnHandler}>
                      Send Email
                    </button>
                  </div>
                </>
              )}
              {pageState.displaying === 2 && (
                <>
                  <h3 style={{ marginTop: "1rem", textAlign: "center" }}>
                    Choose a new strong password for your account.
                  </h3>
                  <div className="register-form__inputs">
                    <div className="password-field">
                      <input
                        autoComplete="off"
                        type={showingPassword ? "text" : "password"}
                        id="password"
                        placeholder="New password"
                        style={{
                          borderColor: !pageState.errorState.passwordOne
                            ? ""
                            : "rgb(250, 107, 107)",
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
                      style={{
                        display: pageState.errorState.passwordOne ? "" : "none",
                      }}
                    >
                      {pageState.errorState.passwordOne}
                    </label>
                    <div className="password-field">
                      <input
                        autoComplete="off"
                        type={showingPasswordR ? "text" : "password"}
                        id="passwordRepeat"
                        placeholder="Repeat new password"
                        style={{
                          borderColor: !pageState.errorState.passwordTwo
                            ? ""
                            : "rgb(250, 107, 107)",
                        }}
                        onChange={repeatUpdateHandler}
                      ></input>
                      <button
                        className="show-password-button"
                        onClick={repeatPasswordShowHandler}
                      >
                        <img
                          src={!showingPasswordR ? viewPass : hidePass}
                        ></img>
                      </button>
                    </div>
                    <label
                      className="error-label-register"
                      htmlFor="passwordRepeat"
                      style={{
                        display: pageState.errorState.passwordTwo ? "" : "none",
                      }}
                    >
                      {pageState.errorState.passwordTwo}
                    </label>
                  </div>
                  <h3 style={{ marginTop: "1rem", textAlign: "center" }}>
                    This password will become the new password you use when
                    logging in to Shortn.
                  </h3>
                  <div className="verification-actions">
                    <button onClick={clickChangePasswordHandler}>
                      Change Password
                    </button>
                  </div>
                </>
              )}
              {pageState.displaying === 3 && (
                <>
                  <h2>
                    You have successfully changed your password, you can now
                    login to your Shortn account using this new password!
                  </h2>
                  <div className="verification-actions">
                    <button onClick={props.clickLogInPasswordReset}>
                      Go To Login
                    </button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default PasswordReset;

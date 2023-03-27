import Services from "../services/Services";
import { useState, useEffect } from "react";
import ErrorModal from "./ErrorModal";

function ProfileEditCard(props) {
  useEffect(() => {
    Services.disableScroll();
  }, []);

  const [errorState, displayErrorModal] = useState([]);

  const cancelError = (e) => {
    e.preventDefault();
    displayErrorModal([]);
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    Services.enableScroll();
    props.cancelError(e);
  };

  const [formState, updateForm] = useState({
    userInput: {
      newName: "",
      newEmail: "",
      newPassword: "",
      currentPassword: "",
      newRepeatPassword: "",
      image: "",
    },
    errorState: {
      newName: "Display name must not be empty.",
      newEmail: "New email is not valid.",
      newPassword:
        props.authData?.sub.split("|")[0] === "authS"
          ? "Password must be 7-15 characters & contain at least 1 digit & 1 special character."
          : "",
      newRepeatPassword: "",
    },
  });

  useEffect(() => {
    const identifier = setTimeout(() => {
      checkUserInputValidaty(formState.userInput, false);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [formState.userInput]);

  const checkUserInputValidaty = (input, forced) => {
    const { newName, newEmail, newPassword, newRepeatPassword } = input;
    const nameError = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(newName)
      ? "Display name must not contain special characters."
      : newName.trim().length === 0
      ? "Display name must not be empty"
      : "";
    const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
      ? ""
      : "Email is not valid.";

    const passwordOneError =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(newPassword)
        ? ""
        : "Password must be 7-15 characters & contain at least 1 digit & 1 special character.";

    const passwordTwoError =
      !passwordOneError && newRepeatPassword != newPassword
        ? "Passwords must match."
        : "";

    updateForm((prevState) => {
      return {
        ...prevState,
        errorState: {
          newName: nameError,
          newEmail: emailError,
          newPassword: passwordOneError,
          newRepeatPassword: passwordTwoError,
        },
      };
    });
  };

  const newNameChangeHandler = (e) => {
    updateForm((prevState) => {
      return {
        ...prevState,
        userInput: {
          ...prevState.userInput,
          newName: e.target.value,
        },
      };
    });
  };
  const newEmailChangeHandler = (e) => {
    updateForm((prevState) => {
      return {
        ...prevState,
        userInput: {
          ...prevState.userInput,
          newEmail: e.target.value,
        },
      };
    });
  };
  const newPasswordChangeHandler = (e) => {
    updateForm((prevState) => {
      return {
        userInput: {
          ...prevState.userInput,
          newPassword: e.target.value,
        },
      };
    });
  };

  const newPasswordRepeatChangeHandler = (e) => {
    updateForm((prevState) => {
      return {
        ...prevState,
        userInput: {
          ...prevState.userInput,
          newRepeatPassword: e.target.value,
        },
      };
    });
  };
  const currentPasswordRepeatChangeHandler = (e) => {
    updateForm((prevState) => {
      return {
        ...prevState,
        userInput: {
          ...prevState.userInput,
          currentPassword: e.target.value,
        },
      };
    });
  };

  const updateEmailUsername = async (e) => {
    e.preventDefault();
    if (
      (formState.userInput.newEmail && formState.errorState.newEmail) ||
      (formState.userInput.newName && formState.errorState.newName)
    ) {
      displayErrorModal([
        <ErrorModal
          cancelError={cancelError}
          title={"400 BAD REQUEST"}
          errorDesc={
            formState.userInput.newEmail && formState.errorState.newEmail
              ? formState.errorState.newEmail
              : formState.errorState.newName
          }
        ></ErrorModal>,
      ]);
      return;
    }
    if (formState.userInput.newEmail || formState.userInput.newName) {
      const response = await Services.updateUserData(
        localStorage.getItem("accessToken"),
        formState.userInput.newName,
        formState.userInput.newEmail,
        "",
        "",
        ""
      );
      if (response.response != "ok") {
        displayErrorModal([
          <ErrorModal
            title={response.response.status}
            errorDesc={response.response.data}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
      return;
    }
  };

  const passwordUpdateButton = async (e) => {
    e.preventDefault();
    if (!formState.userInput.currentPassword) {
      displayErrorModal([
        <ErrorModal
          cancelError={cancelError}
          title={"403 Forbidden"}
          errorDesc={"You mus provide your current password to update it."}
        ></ErrorModal>,
      ]);
      return;
    }
    if (
      formState.userInput.newPassword &&
      formState.userInput.newRepeatPassword &&
      !formState.errorState.newPassword &&
      !formState.errorState.newRepeatPassword
    ) {
      const response = await Services.updateUserData(
        localStorage.getItem("accessToken"),
        "",
        "",
        formState.userInput.newPassword,
        "",
        formState.userInput.currentPassword
      );
      console.log(response);
      if (response.response != "ok") {
        displayErrorModal([
          <ErrorModal
            title={response.response.status}
            errorDesc={response.response.data}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
    } else {
      displayErrorModal([
        <ErrorModal
          title={"400 BAD REQUEST"}
          errorDesc={
            formState.errorState.newPassword
              ? formState.errorState.newPassword
              : formState.errorState.newRepeatPassword
          }
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
    }
  };

  const imageChangeHandler = (e) => {
    updateForm((prevState) => {
      return {
        ...prevState,
        userInput: {
          ...prevState.userInput,
          image: e.target.files[0],
        },
      };
    });
  };

  const imageUploadHandler = async (e) => {
    if (formState.userInput.image) {
      const response = await Services.changeImage(formState.userInput.image);
      if (response.response != "ok") {
        displayErrorModal([
          <ErrorModal
            title={response.response.status}
            errorDesc={response.response.data}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
    } else {
      displayErrorModal([
        <ErrorModal
          title={"400 BAD REQUEST"}
          errorDesc={"You did not provide any image file."}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      return;
    }
  };

  return (
    <>
      {errorState}
      <div className="main-profile-modal">
        <div className="profile-modal-container">
          <button className="close-modal" onClick={cancelHandler}>
            <img
              src="https://img.icons8.com/ios-glyphs/30/null/macos-close.png"
              style={{
                filter: props.dark
                  ? "invert(91%) sepia(99%) saturate(34%) hue-rotate(254deg) brightness(106%) contrast(100%)"
                  : "",
              }}
            />
          </button>
          <h1 className="profile-edit-title">Edit Profile</h1>
          <div className="profile-modal-content">
            <div className="picture-section">
              <h3>Change profile picture</h3>
              <div className="currentPicture">
                <p>Current profile picture: </p>
                <img
                  src={props.authData?.profilePicture}
                  alt="current picture"
                />
              </div>
              <input
                type="file"
                name="pictureInput"
                id="pictureInput"
                onChange={imageChangeHandler}
              />
              <button onClick={imageUploadHandler}>Update</button>
            </div>
            <div className="name-email-section">
              <h3>Change display name and email</h3>
              <div className="name-email-item">
                <p>Current display name</p>
                <input
                  type="text"
                  name="currentName"
                  id="currentName"
                  value={props.authData?.displayName}
                  readOnly={true}
                />
              </div>
              <div className="name-email-item">
                <p>New display name</p>
                <input
                  type="text"
                  name="newName"
                  id="newName"
                  value={formState.userInput.newName}
                  onChange={newNameChangeHandler}
                  autoComplete="off"
                  placeholder="New display name"
                />
              </div>
              <div className="name-email-item">
                <p>Current email address</p>
                <input
                  type="email"
                  name="currentEmail"
                  id="currentEmail"
                  value={
                    props.authData?.email ===
                    "doesnotapply@doesnotapply.doesnotapply"
                      ? "None provided yet"
                      : props.authData?.email
                  }
                  readOnly={true}
                />
              </div>
              <div className="name-email-item">
                <p>New email address</p>
                <input
                  type="email"
                  name="newEmail"
                  id="newEmail"
                  autoComplete="off"
                  value={formState.userInput.newEmail}
                  onChange={newEmailChangeHandler}
                  placeholder="New email adress"
                />
              </div>
              <button onClick={updateEmailUsername}>Update</button>
            </div>
            <div
              className="password-section"
              style={{
                display:
                  props.authData?.sub.split("|")[0] != "authS" ? "none" : "",
              }}
            >
              <h3>Change password</h3>
              <div className="name-email-item">
                <p>Current password</p>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  placeholder="Current Password"
                  autoComplete="off"
                  value={formState.userInput.currentPassword}
                  onChange={currentPasswordRepeatChangeHandler}
                />
              </div>
              <div className="name-email-item">
                <p>New password</p>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  placeholder="New password"
                  autoComplete="off"
                  value={formState.userInput.newPassword}
                  onChange={newPasswordChangeHandler}
                />
              </div>
              <div className="name-email-item">
                <p>Repeat new password</p>
                <input
                  type="password"
                  name="newPasswordRepeat"
                  id="newPasswordRepeat"
                  placeholder="Repeat new password"
                  autoComplete="off"
                  value={formState.userInput.newRepeatPassword}
                  onChange={newPasswordRepeatChangeHandler}
                />
              </div>
              <button onClick={passwordUpdateButton}>Update</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileEditCard;

import "./Header.css";
import lightModeIcon from "../assets/icons8-sun.svg";
import darkModeIcon from "../assets/dark-mode-6682.svg";
import SlideToggle from "./SlideToggle";
import { useEffect, useState } from "react";

const Header = (props) => {
  const [headerClassNames, setHeaderClassNames] = useState(
    "header-container transparent"
  );

  const clickThemeChangeButton = (event) => {
    props.changeThemeHandler();
  };
  function logit() {
    setHeaderClassNames(
      "header-container" + (window.scrollY === 0 ? " transparent" : "")
    );
  }
  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", logit);
    }
    watchScroll();
    return () => {
      window.removeEventListener("scroll", logit);
    };
  });

  const clickLoginHandler = (e) => {
    props.onClickLoginHandler(e);
  };
  const clickRegisterHandler = (e) => {
    props.onClickRegisterHandler(e);
  };

  const clickIconHandler = (e) => {
    props.onClickIconHandler(e);
  };
  return (
    <div className={headerClassNames}>
      <div className="header-content">
        <div className="header-container__icon">
          <h1 onClick={clickIconHandler}>Shortn</h1>
        </div>
        <div className="header-container__actions">
          <div className="header-container__theme">
            <SlideToggle
              valueChangeHandler={clickThemeChangeButton}
              toggled={props.dark}
              labelText={"Dark mode"}
            ></SlideToggle>
          </div>
          <div className="header-container__auth">
            {!props.isLoggedIn ? (
              <>
                <button
                  className="header-auth__button login"
                  onClick={clickLoginHandler}
                >
                  Login
                </button>
                <button
                  className="header-auth__button signup"
                  onClick={clickRegisterHandler}
                >
                  Sign Up
                </button>{" "}
              </>
            ) : (
              <div className="welcome-back-header-holder">
                <h3>Welcome back, <span onClick={props.clickLogoutHandler}>{props.currentUsername}.</span></h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

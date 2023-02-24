import { useState } from "react";
import "./HamburguerMenu.css";
import SlideToggle from "./SlideToggle";

const HamburguerMenu = (props) => {
  const [expanded, toggleExpand] = useState(false);

  const clickMenuHandler = (e) => {
    e.preventDefault();
    toggleExpand((prevState) => {
      return !prevState;
    });
  };

  const clickLoginHandler = (e) => {
    props.clickLoginHandler(e);
  };

  const clickRegisterHandler = (e) => {
    props.clickRegisterHandler(e);
  };

  const clickThemeChangeButton = (e) => {
    props.clickThemeChangeButton(e);
  };

  return (
    <>
      <div className="hamburger-toggle-container">
        <input type="checkbox" id="menu_checkbox" checked={expanded} readOnly />
        <label id="menu-label" htmlFor="menu_checkbox" onClick={clickMenuHandler}>
          <div></div>
          <div></div>
          <div></div>
        </label>
      </div>
      <div
        className="hamburger-main-content"
        style={{ display: expanded ? "grid" : "none" }}
      >
        {!props.isLoggedIn ? (
          <>
            <div>
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
            </div>
          </>
        ) : (
          <div className="welcome-back-header-holder">
            <h3>
              Welcome back,{" "}
              <span onClick={props.clickLogoutHandler}>
                {props.currentUsername}.
              </span>
            </h3>
          </div>
        )}
        <div className="header-container__theme">
          <SlideToggle
            valueChangeHandler={clickThemeChangeButton}
            toggled={props.dark}
            labelText={"Dark mode"}
          ></SlideToggle>
        </div>
      </div>
    </>
  );
};

export default HamburguerMenu;

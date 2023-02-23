import { useState } from "react";
import "./HamburguerMenu.css";

const HamburguerMenu = (props) => {
  const [expanded, toggleExpand] = useState(false);

  const clickMenuHandler = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div>
        <button onClick={clickMenuHandler}>
            
        </button>
      </div>
      <div className="hamburger-main-content">
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
            <h3>
              Welcome back,{" "}
              <span onClick={props.clickLogoutHandler}>
                {props.currentUsername}.
              </span>
            </h3>
          </div>
        )}
      </div>
    </>
  );
};

export default HamburguerMenu;

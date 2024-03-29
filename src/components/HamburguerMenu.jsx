import { useState } from "react";
import "./HamburguerMenu.css";
import SlideToggle from "./SlideToggle";
import Navlink from "./NavLink";

const HamburguerMenu = (props) => {
  const [expanded, toggleExpand] = useState(false);

  const clickMenuHandler = (e) => {
    e.preventDefault();
    toggleExpand((prevState) => {
      return !prevState;
    });
  };

  const clickDashboardHandler = (e) => {
    toggleExpand(false);
    props.clickDashboard(e);
  }

  const clickFeaturesHandler = (e) => {
    toggleExpand(false);
    props.clickFeatures(e);
  }
  
  const clickPricingHandler = (e) => {
    toggleExpand(false);
    props.clickPricing(e);
  }

  const clickHelpCenter = (e) => {
    toggleExpand(false);
    props.clickHelp(e);
  }

  const clickLoginHandler = (e) => {
    console.log("ClickedLogin");
    toggleExpand((prevState) => {
      return !prevState;
    });
    props.clickLoginHandler(e);
  };

  const clickRegisterHandler = (e) => {
    toggleExpand((prevState) => {
      return !prevState;
    });
    props.clickRegisterHandler(e);
  };

  const clickThemeChangeButton = (e) => {
    props.clickThemeChangeButton(e);
  };

  return (
    <>
      <div
        className="hamburger-toggle-container"
        style={{
          filter: !props.dark
            ? "invert(99%) sepia(99%) saturate(2%) hue-rotate(337deg) brightness(110%) contrast(101%)"
            : "",
        }}
      >
        <input type="checkbox" id="menu_checkbox" checked={expanded} readOnly />
        <label
          id="menu-label"
          htmlFor="menu_checkbox"
          onClick={clickMenuHandler}
        >
          <div></div>
          <div></div>
          <div></div>
        </label>
      </div>
      <div
        className="hamburger-main-content"
        style={{ display: expanded ? "grid" : "none" }}
      >
        {!props.reduced ? (
          <>
            <Navlink title="Features" clickHandler={clickFeaturesHandler}></Navlink>
            <Navlink title="Pricing" clickHandler={clickPricingHandler}></Navlink>
            <Navlink title="Help Center" clickHandler={clickHelpCenter}></Navlink>
            {props.isLoggedIn && (
              <Navlink
                title="Dashboard"
                clickHandler={clickDashboardHandler}
              ></Navlink>
            )}
          </>
        ) : (
          <></>
        )}

        {!props.isLoggedIn ? (
          <>
            <div className="hamburguer-auth-buttons">
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
          <div className="welcome-back-header-holder-hamburguer">
            <img
              src={props.userLogo}
              onClick={props.clickProfileHandler}
              className="user-profile-pic-hamburguer"
            ></img>
            <button
              className="header-auth__button signup"
              onClick={props.clickLogoutHandler}
            >
              Logout
            </button>
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

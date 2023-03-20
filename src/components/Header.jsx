import "./Header.css";
import SlideToggle from "./SlideToggle";
import { useEffect, useState } from "react";
import HamburguerMenu from "./HamburguerMenu";
import Navlink from "./NavLink";

const Header = (props) => {
  const [headerClassNames, setHeaderClassNames] = useState(
    "header-container transparent"
  );

  const [hambugerDisplaying, toggleSize] = useState(false);

  useEffect(() => {
    function handleResize() {
      toggleSize(window.innerWidth < 1440);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const featuresClickHandler = (e) => {
    e.preventDefault();
    const featuresElement = document.getElementById("featuresID");
    featuresElement?.scrollIntoView();
  };

  const pricingClickHandler = (e) => {
    e.preventDefault();
    const pricingElement = document.getElementById("pricingsID");
    pricingElement?.scrollIntoView();
  };
  const helpCenterHandler = (e) => {
    e.preventDefault();
    const helpCenterElement = document.getElementById("help-center-id");
    helpCenterElement?.scrollIntoView();
  };

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
        {hambugerDisplaying ? (
          <HamburguerMenu
            clickLoginHandler={clickLoginHandler}
            clickRegisterHandler={clickRegisterHandler}
            clickLogoutHandler={props.clickLogoutHandler}
            dark={props.dark}
            isLoggedIn={props.isLoggedIn}
            currentUsername={props.currentUsername}
            clickThemeChangeButton={clickThemeChangeButton}
            userLogo={props.userLogo}
            clickDashboard={props.clickDashboard}
            clickFeatures={featuresClickHandler}
            clickPricing={pricingClickHandler}
          ></HamburguerMenu>
        ) : (
          <>
            <div className="header-navigation">
              <Navlink
                title="Features"
                clickHandler={featuresClickHandler}
              ></Navlink>
              <Navlink
                title="Pricing"
                clickHandler={pricingClickHandler}
              ></Navlink>
              <Navlink
                title="Help Center"
                clickHandler={helpCenterHandler}
              ></Navlink>
              {props.isLoggedIn && (
                <Navlink
                  title="Dashboard"
                  clickHandler={props.clickDashboard}
                ></Navlink>
              )}
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
                    <img
                      src={props.userLogo}
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

import HamburguerMenu from "./HamburguerMenu";
import SlideToggle from "./SlideToggle";
import ProfileEditCard from "./ProfileEditCard";
import { useState, useEffect } from "react";

const ReducedHeader = (props) => {
  const [headerClassNames, setHeaderClassNames] = useState(
    "header-container transparent"
  );

  const [hambugerDisplaying, toggleSize] = useState(false);
  const [profileEdit, displayProfileEdit] = useState([]);

  const closeProfileEdit = (e) => {
    displayProfileEdit([]);
  };

  const clickProfileHandler = (e) => {
    displayProfileEdit([
      <ProfileEditCard
        userLogo={props.userLogo}
        dark={props.dark}
        cancelError={closeProfileEdit}
        authData={props.authData}
      ></ProfileEditCard>,
    ]);
  };

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

  const clickIconHandler = (e) => {
    props.onClickIconHandler(e);
  };
  return (
    <>
      {profileEdit}
      <div className={headerClassNames}>
        <div className="header-content">
          <div className="header-container__icon">
            <h1 onClick={clickIconHandler}>Shortn</h1>
          </div>
          {hambugerDisplaying ? (
            <HamburguerMenu
              clickLogoutHandler={props.clickLogoutHandler}
              dark={props.dark}
              isLoggedIn={props.isLoggedIn}
              currentUsername={props.currentUsername}
              clickThemeChangeButton={clickThemeChangeButton}
              userLogo={props.userLogo}
              clickLoginHandler={props.clickLoginHandler}
              clickRegisterHandler={props.clickRegisterHandler}
              clickProfileHandler={clickProfileHandler}
              reduced={true}
            ></HamburguerMenu>
          ) : (
            <>
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
                        onClick={props.clickLoginHandler}
                      >
                        Login
                      </button>
                      <button
                        className="header-auth__button signup"
                        onClick={props.clickRegisterHandler}
                      >
                        Sign Up
                      </button>{" "}
                    </>
                  ) : (
                    <div className="welcome-back-header-holder">
                      <img
                        onClick={clickProfileHandler}
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
    </>
  );
};

export default ReducedHeader;

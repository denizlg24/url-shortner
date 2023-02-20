import "./Header.css";
import lightModeIcon from "../assets/icons8-sun.svg";
import darkModeIcon from "../assets/dark-mode-6682.svg";

const Header = (props) => {
  const clickThemeChangeButton = (event) => {
    props.changeThemeHandler();
  };

  return (
    <div className="header-container">
      <div className="header-container__icon"></div>
      <div className="header-container__actions">
        <div className="header-container__theme">
          <button
            className="header-theme-button"
            onClick={clickThemeChangeButton}
          >
            <img
              className={
                "header-theme-button__icon" +
                (props.dark
                  ? " header-theme-icon__dark"
                  : " header-theme-icon__light")
              }
              src={!props.dark ? darkModeIcon : lightModeIcon}
              alt={!props.dark ? "Moon Icon" : "Sun Icon"}
              draggable="false"
            ></img>
          </button>
        </div>
        <div className="header-container__auth">
            <button className="header-auth__button login">Login</button>
            <button className="header-auth__button signup">Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Header;

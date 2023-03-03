import { useState, useEffect } from "react";
import AuthenticationPage from "./pages/AuthenticationPage";
import Header from "./components/Header";
import themes from "./themes/themes";
import LandingPage from "./pages/LandingPage";
import auth from "./services/auth";
import axios from "axios";
import VerificationPage from "./pages/VerificationPage";
import Dashboard from "./pages/Dashboard";
import jwt_decode from "jwt-decode";
import ReducedHeader from "./components/ReducedHeader";
import ErrorModal from "./components/ErrorModal";

function App() {
  const [theme, setTheme] = useState();
  const [pageToDisplay, displayPage] = useState("landing");
  const [authChosen, chooseAuth] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [authData, setAuthData] = useState();
  const [emailToVerify, setEmailToVerify] = useState();
  const [errorState, displayErrorModal] = useState([]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      localStorage.setItem(
        "themeChosen",
        prevTheme === "dark" ? "light" : "dark"
      );
      return prevTheme === "dark" ? "light" : "dark";
    });
  };

  useEffect(() => {
    const previousTheme = localStorage.getItem("themeChosen");
    setTheme(previousTheme ? previousTheme : "dark");
  }, []);

  useEffect(() => {
    if (!theme) {
      return;
    }
    const root = document.documentElement;
    const currentTheme = themes[theme];
    Object.keys(currentTheme).forEach((key) => {
      root.style.setProperty(key, currentTheme[key]);
    });
  }, [theme]);

  const onClickLoginHandler = (e) => {
    e.preventDefault();
    if (pageToDisplay !== "auth") {
      displayPage("auth");
    }
    chooseAuth(false);
  };

  const onClickRegisterHandler = (e) => {
    e.preventDefault();
    if (pageToDisplay !== "auth") {
      displayPage("auth");
    }
    chooseAuth(true);
  };

  const onClickIconHandler = (e) => {
    e.preventDefault();
    if (pageToDisplay !== "landing") {
      displayPage("landing");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const loginSuccessHandler = () => {
    displayPage("landing");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    setAuthData(null);
    setLoggedIn(false);
    displayPage("landing");
  };

  useEffect(() => {
    checkTokens();
    handleAuthCallback();
  }, []);

  const cancelError = (e) => {
    e.preventDefault();
    displayErrorModal([]);
  };

  const checkTokens = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const idToken = localStorage.getItem("idToken");
    if (accessToken && idToken) {
      const tokenExpirationTime = jwt_decode(idToken).exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpirationThreshold = 60;
      if (tokenExpirationTime - currentTime < tokenExpirationThreshold) {
        console.log("Outdated token, loggin out!");
        displayErrorModal([
          <ErrorModal
            title={"Error Loging-in!"}
            errorDesc={"Your session has expired, login again!"}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        handleLogout();
        return;
      }
      const verified = jwt_decode(idToken).email_verified;
      let origin = jwt_decode(idToken).sub;
      if (verified || origin.slice(0, 5) != "auth0") {
        setLoggedIn(true);
        displayPage("landing");
        setAuthData(jwt_decode(idToken));
        loginSuccessHandler();
      } else {
        displayErrorModal([
          <ErrorModal
            title={"Error Loging-in!"}
            errorDesc={"You have not verified your email yet!"}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        handleLogout();
      }
    }
  };

  const registrationSuccessHandler = (_email) => {
    setEmailToVerify(_email);
    displayPage("verifyEmail");
  };

  const handleFacebookLogin = () => {
    auth.authorize({
      connection: "facebook",
    });
  };

  const handleGoogleLogin = () => {
    auth.authorize({
      connection: "google-oauth2",
    });
  };

  const handleGithubLogin = () => {
    auth.authorize({
      connection: "github",
    });
  };

  function handleAuthCallback() {
    auth.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        localStorage.setItem("accessToken", authResult.accessToken);
        localStorage.setItem("idToken", authResult.idToken);
        checkTokens();
      } else if (err) {
        console.log(err);
      }
    });
    window.history.replaceState(null, null, window.location.origin);
  }

  const clickDashboardHandler = (e) => {
    e.preventDefault();
    if (pageToDisplay !== "dashboard") {
      displayPage("dashboard");
    }
  };

  if (pageToDisplay === "landing") {
    return (
      <>
        {errorState}
        <Header
          dark={theme === "dark"}
          changeThemeHandler={toggleTheme}
          onClickRegisterHandler={onClickRegisterHandler}
          onClickLoginHandler={onClickLoginHandler}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.nickname : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.picture : ""}
          clickDashboard={clickDashboardHandler}
        ></Header>
        <LandingPage dark={theme === "dark"}></LandingPage>
      </>
    );
  }
  if (pageToDisplay === "auth") {
    return (
      <>
        {errorState}
        <Header
          dark={theme === "dark"}
          changeThemeHandler={toggleTheme}
          onClickRegisterHandler={onClickRegisterHandler}
          onClickLoginHandler={onClickLoginHandler}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.nickname : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.picture : ""}
        ></Header>
        <AuthenticationPage
          dark={theme === "dark"}
          register={authChosen}
          loginSuccessHandler={checkTokens}
          registrationSuccess={registrationSuccessHandler}
          handleFacebookLogin={handleFacebookLogin}
          handleGoogleLogin={handleGoogleLogin}
          handleGithubLogin={handleGithubLogin}
        ></AuthenticationPage>
      </>
    );
  }
  if (pageToDisplay === "verifyEmail") {
    return (
      <>
        {errorState}
        <Header
          dark={theme === "dark"}
          changeThemeHandler={toggleTheme}
          onClickRegisterHandler={onClickRegisterHandler}
          onClickLoginHandler={onClickLoginHandler}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.nickname : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.picture : ""}
        ></Header>
        <VerificationPage
          emailToVerify={emailToVerify}
          onClickHandler={onClickLoginHandler}
        ></VerificationPage>
      </>
    );
  }
  if (pageToDisplay === "dashboard") {
    return (
      <>
        <ReducedHeader
          dark={theme === "dark"}
          changeThemeHandler={toggleTheme}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.nickname : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.picture : ""}
        ></ReducedHeader>
        <Dashboard
          username={authData ? authData.nickname : ""}
          userId={authData ? authData.sub : ""}
          dark={theme === "dark"}
        ></Dashboard>
      </>
    );
  }
}

export default App;

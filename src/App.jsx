import { useState, useEffect } from "react";
import AuthenticationPage from "./pages/AuthenticationPage";
import Header from "./components/Header";
import themes from "./themes/themes";
import LandingPage from "./pages/LandingPage";
import Services from "./services/Services";
import VerificationPage from "./pages/VerificationPage";
import Dashboard from "./pages/Dashboard";
import ReducedHeader from "./components/ReducedHeader";
import ErrorModal from "./components/ErrorModal";
import Features from "./pages/Features";
import darkLogo from "./assets/LOGODARK.png";
import lightLogo from "./assets/LOGOWHITE.png";
import Pricing from "./pages/Pricing";
import PaymentPage from "./pages/PaymentPage";

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

  const handleLogout = async () => {
    await Services.logoutUser(localStorage.getItem("accessToken"));
    localStorage.removeItem("accessToken");
    setAuthData([]);
    setLoggedIn(false);
    displayPage("landing");
  };

  useEffect(() => {
    handleAuthCallback();
    checkTokens();
  }, []);

  const cancelError = (e) => {
    e.preventDefault();
    displayErrorModal([]);
  };

  const checkTokens = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const response = await Services.validateToken(accessToken);
      if (response.response === "ok") {
        if (!response.data.emailVerified) {
          displayErrorModal([
            <ErrorModal
              title={"Error Logging In!"}
              errorDesc={"Your email hasnt been verified yet!"}
              cancelError={cancelError}
            ></ErrorModal>,
          ]);
          handleLogout();
          return;
        }
        setAuthData(response.data);
        setLoggedIn(true);
        displayPage("landing");
        loginSuccessHandler();
      } else {
        displayErrorModal([
          <ErrorModal
            title={response.response.status}
            errorDesc={response.response.data}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        handleLogout();
      }
    }
  };

  const handleAuthCallback = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("token");
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      window.history.replaceState(null, null, window.location.origin);
      checkTokens();
      return;
    }
  };

  const registrationSuccessHandler = (_email) => {
    setEmailToVerify(_email);
    displayPage("verifyEmail");
  };

  const handleSteamLogin = () => {
    window.location.href = "https://shortn.at/api/auth/steam";
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://shortn.at/api/auth/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "https://shortn.at/api/auth/github";
  };

  const clickDashboardHandler = (e) => {
    e.preventDefault();
    if (pageToDisplay !== "dashboard") {
      displayPage("dashboard");
    }
  };

  const clickFreeHandler = (e) => {
    if (!isLoggedIn && pageToDisplay !== "auth") {
      chooseAuth(true);
      displayPage("auth");
    }
  };

  if (pageToDisplay === "landing") {
    return (
      <>
        {errorState}
        {/*<PaymentPage></PaymentPage>*/}
        <Header
          icon={theme === "dark" ? darkLogo : lightLogo}
          dark={theme === "dark"}
          changeThemeHandler={toggleTheme}
          onClickRegisterHandler={onClickRegisterHandler}
          onClickLoginHandler={onClickLoginHandler}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.displayName : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.profilePicture : ""}
          clickDashboard={clickDashboardHandler}
        ></Header>
        <LandingPage
          dark={theme === "dark"}
          isLoggedIn={isLoggedIn}
        ></LandingPage>
        <Features dark={theme === "dark"}></Features>
        <Pricing
          clickFreeHandler={clickFreeHandler}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          sub={authData ? authData.sub : ""}
        ></Pricing>
      </>
    );
  }
  if (pageToDisplay === "auth") {
    return (
      <>
        {errorState}
        <Header
          icon={theme === "dark" ? darkLogo : lightLogo}
          dark={theme === "dark"}
          changeThemeHandler={toggleTheme}
          onClickRegisterHandler={onClickRegisterHandler}
          onClickLoginHandler={onClickLoginHandler}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.displayName : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.profilePicture : ""}
        ></Header>
        <AuthenticationPage
          dark={theme === "dark"}
          register={authChosen}
          loginSuccessHandler={checkTokens}
          registrationSuccess={registrationSuccessHandler}
          handleSteamLogin={handleSteamLogin}
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
          icon={theme === "dark" ? darkLogo : lightLogo}
          dark={theme === "dark"}
          changeThemeHandler={toggleTheme}
          onClickRegisterHandler={onClickRegisterHandler}
          onClickLoginHandler={onClickLoginHandler}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.displayName : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.profilePicture : ""}
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
          icon={theme === "dark" ? darkLogo : lightLogo}
          dark={theme === "dark"}
          changeThemeHandler={toggleTheme}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.displayName : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.profilePicture : ""}
        ></ReducedHeader>
        <Dashboard
          username={authData ? authData.displayName : ""}
          userId={authData ? authData.sub : ""}
          dark={theme === "dark"}
        ></Dashboard>
      </>
    );
  }
}

export default App;

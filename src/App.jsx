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
    const response = await Services.logoutUser(
      localStorage.getItem("accessToken")
    );
    if (response.response === "ok") {
      localStorage.removeItem("accessToken");
      setAuthData([]);
      setLoggedIn(false);
      displayPage("landing");
    } else {
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
    }
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
        if(!response.data.emailVerified){
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
        console.log(response);
        displayErrorModal([
          <ErrorModal
            title={response.response.status}
            errorDesc={response.response.data}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
      }
    }
  };

  const handleAuthCallback = async () =>{
    const queryParams = new URLSearchParams(window.location.search)
    const accessToken = queryParams.get("token");
    if(accessToken){
      localStorage.setItem("accessToken",accessToken);
      window.history.replaceState(null, null, window.location.origin);
      checkTokens();
      return;
    }
  }

  const registrationSuccessHandler = (_email) => {
    setEmailToVerify(_email);
    displayPage("verifyEmail");
  };

  const handleFacebookLogin = () => {
    window.location.href = "https://shortn.at/api/auth/facebook";
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
          currentUsername={authData ? authData.username : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.profilePicture : ""}
          clickDashboard={clickDashboardHandler}
        ></Header>
        <LandingPage dark={theme === "dark"} isLoggedIn={isLoggedIn}></LandingPage>
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
          currentUsername={authData ? authData.username : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.profilePicture : ""}
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
          currentUsername={authData ? authData.username : ""}
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
          dark={theme === "dark"}
          changeThemeHandler={toggleTheme}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.username : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.profilePicture : ""}
        ></ReducedHeader>
        <Dashboard
          username={authData ? authData.username : ""}
          userId={authData ? authData.sub : ""}
          dark={theme === "dark"}
        ></Dashboard>
      </>
    );
  }
}

export default App;

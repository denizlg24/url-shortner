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
import Pricing from "./pages/Pricing";
import MoreInfo from "./pages/MoreInfo";
import HelpCenter from "./pages/HelpCenter";
import PasswordReset from "./pages/PasswordReset";

function App() {
  const [theme, setTheme] = useState();
  const [pageToDisplay, displayPage] = useState("landing");
  const [authChosen, chooseAuth] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [authData, setAuthData] = useState();
  const [emailToVerify, setEmailToVerify] = useState();
  const [errorState, displayErrorModal] = useState([]);
  const [resetToken,setResetToken] = useState("");

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

  const [myPlan, setPlan] = useState();

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

  const tryFreeHandler = (e) => {
    const element = document.getElementById("try-free-id");
    if (element) {
      element.scrollIntoView();
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

  const getSubscription = async () => {
    const response = await Services.getPlan(
      localStorage.getItem("accessToken")
    );
    if (response.response === "ok") {
      setPlan(response.data);
    } else {
      props.handleLogout();
    }
  };

  const removeTestLink = async () => {
    const getUrlCreated = () => {
      return JSON.parse(localStorage.getItem("linkCreatedTest"));
    };
    const url = getUrlCreated();
    if (!url) {
      return;
    }
    for (let index = 0; index < url[0].length; index++) {
      setTimeout(async () => {
        await Services.removeLink(url[0][index].shortUrl);
        localStorage.removeItem("linkCreatedTest");
      }, 200);
    }
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
        removeTestLink();
        setAuthData(response.data);
        setLoggedIn(true);
        displayPage("landing");
        getSubscription();
        loginSuccessHandler();
      } else {
        displayErrorModal([
          <ErrorModal
            title={response.response.status}
            errorDesc={"You've been logged out. Log back in."}
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
    const confirmedId = queryParams.get("confirmed");
    const resetToken = queryParams.get("reset");
    if(resetToken){
      setResetToken(resetToken);
      displayPage("passReset");
      window.history.replaceState(null, null, window.location.origin);
      return;
    }
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      window.history.replaceState(null, null, window.location.origin);
      checkTokens();
      return;
    }
    if (confirmedId) {
      displayErrorModal([
        <ErrorModal
          success={true}
          title={"Success"}
          errorDesc={"Thanks for confirming your email. You can now log in"}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      window.history.replaceState(null, null, window.location.origin);
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

  const clickLogInPasswordResetHandler = (e) => {
    e.preventDefault();
    if (!isLoggedIn && pageToDisplay !== "auth") {
      chooseAuth(false);
      displayPage("auth");
    }
  }

  const startPasswordResetFlowHandler = () => {
    displayPage("passReset");
  };

  const resetTokenResetHandler = () => {
    setResetToken("");
  }

  if (pageToDisplay === "landing") {
    return (
      <>
        {errorState}
        {/*<PaymentPage></PaymentPage>*/}
        <Header
          authData={authData}
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
          clickDashboard={clickDashboardHandler}
          tryFree={tryFreeHandler}
        ></LandingPage>
        <Features dark={theme === "dark"}></Features>
        <Pricing
          clickFreeHandler={clickFreeHandler}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          sub={authData ? authData.sub : ""}
          stripeId={authData ? authData.stripeId : ""}
          myPlan={myPlan}
        ></Pricing>
        <HelpCenter sub={authData ? authData.sub : ""}></HelpCenter>
      </>
    );
  }
  if (pageToDisplay === "auth") {
    return (
      <>
        {errorState}
        <Header
          authData={authData}
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
          startPasswordResetFlow={startPasswordResetFlowHandler}
        ></AuthenticationPage>
      </>
    );
  }
  if (pageToDisplay === "verifyEmail") {
    return (
      <>
        {errorState}
        <Header
          authData={authData}
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
  if (pageToDisplay === "passReset") {
    return (
      <>
        <ReducedHeader
          authData={authData}
          dark={theme === "dark"}
          clickLoginHandler={onClickLoginHandler}
          clickRegisterHandler={onClickRegisterHandler}
          changeThemeHandler={toggleTheme}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.displayName : ""}
          clickLogoutHandler={handleLogout}
          userLogo={authData ? authData.profilePicture : ""}
        ></ReducedHeader>
        <PasswordReset resetToken={resetToken} clickLogInPasswordReset={clickLogInPasswordResetHandler} resetTokenReset={resetTokenResetHandler}></PasswordReset>
      </>
    );
  }
  if (pageToDisplay === "dashboard") {
    return (
      <>
        <ReducedHeader
          authData={authData}
          clickLoginHandler={onClickLoginHandler}
          clickRegisterHandler={onClickRegisterHandler}
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
          myPlan={myPlan ? myPlan.subscription : ""}
          home={onClickIconHandler}
          authData={authData}
        ></Dashboard>
      </>
    );
  }
}

export default App;

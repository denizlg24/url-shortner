import { useState, useEffect } from "react";
import AuthenticationPage from "./pages/AuthenticationPage";
import Header from "./components/Header";
import themes from "./themes/themes";
import LandingPage from "./pages/LandingPage";
import auth from "./services/auth";
import axios from "axios";
import VerificationPage from "./pages/VerificationPage";
import Dashboard from "./pages/Dashboard";
import auth0 from "auth0-js";

function App() {
  const [theme, setTheme] = useState();
  const [pageToDisplay, displayPage] = useState("landing");
  const [authChosen, chooseAuth] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [authData, setAuthData] = useState();
  const [emailToVerify, setEmailToVerify] = useState();

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

  const checkTokens = () => {
    const accessToken = localStorage.getItem("accessToken");
    const idToken = localStorage.getItem("idToken");
    if (accessToken && idToken) {
      const userInfoUrl = `https://dev-r8h4horutpz3j3g6.us.auth0.com/userinfo`;

      axios
        .get(userInfoUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          let origin = response.data.sub;
          if (response.data.email_verified || origin.slice(0, 5) != "auth0") {
            setLoggedIn(true);
            displayPage("landing");
            setAuthData(response.data);
            loginSuccessHandler();
            var auth0Manage = new auth0.Management({
              domain: "dev-r8h4horutpz3j3g6.us.auth0.com",
              token: accessToken,
            });
            console.log(accessToken);

            var userId = origin;
            var userMetadata = { links: "empty" };

            auth0Manage.patchUserMetadata(
              userId,
              userMetadata,
              function (err, authResult) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(
                    "patchUserMetadata succeeded: " + JSON.stringify(authResult)
                  );
                }
              }
            );
          } else {
            console.log("Not Verified!");
          }
        })
        .catch((error) => {
          // Handle error
          handleLogout();
          console.error(error);
        });
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
        // Call the Auth0 Management API to create or link the user profile
        // using the access token
        checkTokens();
        // make an API request to create or link the user profile
      } else if (err) {
        console.log(err);
      }
    });
    window.history.replaceState(null, null, window.location.origin);
  }

  if (pageToDisplay === "landing") {
    return (
      <>
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
        <button
          style={{ zIndex: "999", position: "absolute" }}
          onClick={() => {
            displayPage("dashboard");
          }}
        >
          Dashboard
        </button>
        <LandingPage dark={theme === "dark"}></LandingPage>
      </>
    );
  }
  if (pageToDisplay === "auth") {
    return (
      <>
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
    return <Dashboard></Dashboard>;
  }
}

export default App;

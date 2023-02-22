import { useState, useEffect } from "react";
import AuthenticationPage from "./pages/AuthenticationPage";
import Header from "./components/Header";
import themes from "./themes/themes";
import LandingPage from "./pages/LandingPage";
import auth from "./services/auth";
import axios from "axios";

function App() {
  const [theme, setTheme] = useState("dark");
  const [pageToDisplay, displayPage] = useState("landing");
  const [authChosen, chooseAuth] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [authData,setAuthData] = useState();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];
    Object.keys(currentTheme).forEach((key) => {
      root.style.setProperty(key, currentTheme[key]);
    });
  }, [theme]);

  const onClickLoginHanlder = (e) => {
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
    checkTokens();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
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
          // Handle successful response
          setLoggedIn(true);
          displayPage("landing");
          setAuthData(response.data);
        })
        .catch((error) => {
          // Handle error
          handleLogout();
          console.error(error);
        });
    }
  };

  const registrationSuccessHandler = () =>{
    displayPage(LandingPage);
  }

  const handleFacebookLogin = () =>{
    auth.authorize({
      connection: "facebook",
    });
  }

  const handleGoogleLogin = () =>{
    auth.authorize({
      connection: "google-oauth2",
    });
  }

  const handleGithubLogin = () =>{
    auth.authorize({
      connection: "github",
    });
  }

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
          onClickLoginHandler={onClickLoginHanlder}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.nickname : ""}
          clickLogoutHandler={handleLogout}
        ></Header>
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
          onClickLoginHandler={onClickLoginHanlder}
          onClickIconHandler={onClickIconHandler}
          isLoggedIn={isLoggedIn}
          currentUsername={authData ? authData.nickname : ""}
          clickLogoutHandler={handleLogout}
        ></Header>
        <AuthenticationPage
          dark={theme === "dark"}
          register={authChosen}
          loginSuccessHandler={loginSuccessHandler}
          registrationSuccess={registrationSuccessHandler}
          handleFacebookLogin={handleFacebookLogin}
          handleGoogleLogin={handleGoogleLogin}
          handleGithubLogin={handleGithubLogin}
        ></AuthenticationPage>
      </>
    );
  }
}

export default App;

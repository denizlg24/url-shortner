import illustration from "../assets/undraw_lost_online_re_upmy.svg";
import darkIllustration from "../assets/undraw_lost_online_re_upmy dark.svg";
import LinkItem from "../components/LinkItem";
import ErrorModal from "../components/ErrorModal";
import Services from "../services/Services";

import "./LandingPage.css";
import { useEffect, useState } from "react";

const LandingPage = (props) => {
  const [longUrl, setLongUrl] = useState("");
  const [myUrls, setUrls] = useState([]);
  const [errorState, displayErrorModal] = useState([]);

  const changeLongUrlHandler = (e) => {
    setLongUrl(e.target.value);
  };

  useEffect(() => {
    setUrls([]);
    const getUrlCreated = () => {
      return JSON.parse(localStorage.getItem('linkCreatedTest'));
    }
    const url = getUrlCreated();
    if(!url){
      setUrls([]);
      return;
    }
    setUrls(...url);
  },[])

  const handleCreateShortUrl = async () => {
    if(myUrls.length > 4){
      displayErrorModal([
        <ErrorModal
          title={"403"}
          errorDesc={"You cannot create any more links without being logged in!"}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      setLongUrl("");
      return;
    }
    const response = await Services.createShortLink(longUrl, "authS|jvcz9epaebumxnqzyxfj");
    setLongUrl("");
    if (response.response === "ok") {
      setUrls((prevState) => {
        const newUrls = [...prevState,response];
        localStorage.setItem('linkCreatedTest', JSON.stringify([newUrls]));
        return newUrls;
      });
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

  const cancelError = (e) => {
    e.preventDefault();
    displayErrorModal([]);
  };

  const handleGetClickAnalytics = async (shortURL) => {
    displayErrorModal([
      <ErrorModal
        title={"Error getting stats."}
        errorDesc={"You cannot get advanced stats if you are not logged in!"}
        cancelError={cancelError}
      ></ErrorModal>,
    ]);
  };

  return (
    <>
      {errorState}
      <div className="landingpage-main">
        <div className="landingpage-container">
          <div className="landingpage-info-container">
            <h1 className="landingpage-info-hero">
              Welcome to <span className="special-text-landing">Shortn</span>
            </h1>
            <h3 className="landingpage-info-catch">
              We are more than just shorter links.
            </h3>
            <h4 className="landingpage-info-extra">
              Increase your brand's recognition and get detailed insights on how
              your links are performing.
            </h4>
          </div>
          <div
            className="landingpage-illustration-container"
            style={{
              backgroundImage:
                "url('" + (props.dark ? darkIllustration : illustration) + "')",
            }}
          ></div>
        </div>
        <hr className="features-divider-bottom"/>
        {!props.isLoggedIn && <div className="main-content-dashboard-landingpage">
          <h1 className="dasboard-title">
            <span>Try it out! <span><h4>{`(${5-myUrls.length} remaining.)`}</h4></span></span>
          </h1>
          <div className="input-actions-dashboard">
            <input
              type="text"
              placeholder="Enter your long url"
              value={longUrl}
              onChange={changeLongUrlHandler}
            ></input>
            <button onClick={handleCreateShortUrl}>Shortn</button>
          </div>
          <div className="created-links-dashboard">
            {myUrls.length > 0 &&
              myUrls.map((url) => {
                return (
                  <LinkItem
                    longUrl={url.longUrl}
                    shortUrl={url.shortUrl}
                    key={url.shortUrl}
                    onClickHandler={handleGetClickAnalytics}
                    dark={props.dark}
                  ></LinkItem>
                );
              })}
              {myUrls.length === 0 && (
                <div className="no-links-holder">
                  <h3>You haven't created any short link yet! Create one, it's free!</h3>
                </div>
              )}
          </div>
        </div>}
        
      </div>
    </>
  );
};

export default LandingPage;

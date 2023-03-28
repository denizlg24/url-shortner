import { useEffect, useState } from "react";
import LinkItem from "../components/LinkItem";
import Services from "../services/Services";
import ErrorModal from "../components/ErrorModal";
import "./Dashboard.css";
import LinkStats from "./LinkStats";
import { BsChevronDoubleRight, BsChevronDoubleLeft, BsFillReplyFill } from "react-icons/bs";

const Dashboard = (props) => {
  const [myUrls, setUrls] = useState([]);
  const [currentLongUrl, changecurrentLongUrl] = useState("");
  const [currentShortCode, changecurrentShortCode] = useState("");
  const [shortCodeApplied, applyCode] = useState(false);
  const [errorState, displayErrorModal] = useState([]);
  const [selectedPage, selectPage] = useState(0);
  const [urlData, setUrlData] = useState();
  const [urlStartedCreation, starturlCreation] = useState(false);

  const urlPerPage = 3;

  const getUrls = async () => {
    let response = await Services.getUrls(props.userId);
    if (response.response === "ok") {
      response.data.sort(function (a, b) {
        var keyA = new Date(a.date),
          keyB = new Date(b.date);
        // Compare the 2 dates
        if (keyA >= keyB) return -1;
        if (keyA < keyB) return 1;
      });
      setUrls(response.data);
      const numberOfPages = Math.ceil(response.data.length / urlPerPage);
      if (numberOfPages >= 2) {
        if (selectedPage >= numberOfPages) {
          selectPage(numberOfPages - 1);
        }
      }
      else{
        selectPage(0);
      }
    } else {
      setUrls([]);
    }
  };

  useEffect(() => {
    getUrls();
  }, []);

  const handleCreateShortUrl = async () => {
    const response = await Services.createShortLink(
      currentLongUrl,
      props.userId,
      applyCode ? currentShortCode : ""
    );
    if (response.response === "ok") {
      getUrls();
    } else {
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
    }
    cancelApplyCodeHandler();
  };

  const handleGetClickAnalytics = async (shortURL) => {
    const response = await Services.getStats(shortURL);
    if (response.response === "ok") {
      console.log(response.data);
      setUrlData(response.data);
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

  const changeHandler = (e) => {
    changecurrentLongUrl(e.target.value);
  };

  const changeCodeHandler = (e) => {
    changecurrentShortCode(e.target.value);
  };

  const cancelError = (e) => {
    e.preventDefault();
    displayErrorModal([]);
  };

  const prevPageHandler = (e) => {
    e.preventDefault();
    selectPage((prevSelected) => {
      let numberOfPages = Math.ceil(myUrls.length / urlPerPage);
      if (prevSelected - 1 < 0) {
        return numberOfPages - 1;
      }
      return prevSelected - 1;
    });
  };

  const nextPageHandler = (e) => {
    e.preventDefault();
    selectPage((prevSelected) => {
      let numberOfPages = Math.ceil(myUrls.length / urlPerPage);
      if (prevSelected + 1 === numberOfPages) {
        return 0;
      }
      return prevSelected + 1;
    });
  };

  const cancelStatsPage = (e) => {
    e.preventDefault();
    setUrlData();
  };

  const onDeleteHandler = async (shortUrl) => {
    await Services.removeLink(shortUrl);
    await getUrls();
  };

  const applyCodeHandler = (e) => {
    if (!currentShortCode) {
      displayErrorModal([
        <ErrorModal
          title={"400"}
          errorDesc={"The short code cannot be empty!"}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      changecurrentShortCode("");
      return;
    }
    if (currentShortCode.trim().length <= 0) {
      displayErrorModal([
        <ErrorModal
          title={"400"}
          errorDesc={"The short code cannot be blank!"}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      changecurrentShortCode("");
      return;
    }
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(currentShortCode)) {
      displayErrorModal([
        <ErrorModal
          title={"400"}
          errorDesc={"The short code can only contain letters digits or '-_' !"}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      changecurrentShortCode("");
      return;
    }
    applyCode(true);
  };

  const cancelApplyCodeHandler = (e) => {
    changecurrentShortCode("");
    changecurrentLongUrl("")
    starturlCreation(false);
    applyCode(false);
  };

  const handleStartShortCodeCreation = (e) => {
    starturlCreation(true);
  };

  return (
    <>
      {errorState}
      {urlData && (
        <LinkStats
          data={urlData.clicks}
          myPlan={props.myPlan}
          shortUrl={urlData.shortUrl}
          sub={urlData.userId}
          shortCode={urlData.urlCode}
          lastClicked={urlData.clicks.lastClick}
          dark={props.dark}
          closeStats={cancelStatsPage}
        ></LinkStats>
      )}
      <div className="main-dashboard-container">
        <div className="main-dashboard-content">
          <div className="back-home-dashboard" onClick={props.home}>
            <BsFillReplyFill/>
            <p>Home</p>
          </div>
          <div className="main-content-dashboard">
            <h1 className="dasboard-title">
              <span>{props.username}'s</span> Dashboard
            </h1>
            {!urlStartedCreation && (
              <div className="input-actions-dashboard">
                <input
                  type="text"
                  placeholder="Enter your long url"
                  value={currentLongUrl}
                  onChange={changeHandler}
                ></input>{" "}
                <button
                  onClick={
                    props.myPlan === "pro"
                      ? handleStartShortCodeCreation
                      : handleCreateShortUrl
                  }
                >
                  Shortn
                </button>
              </div>
            )}
            {props.myPlan === "pro" && urlStartedCreation && (
              <div id="input-actions-dashboard-shortCode">
                {shortCodeApplied && (
                  <div className="short-code-info-container">
                    <h3>
                      Your link will look like:{" "}
                      <span>shortn.at/{currentShortCode}</span>
                    </h3>
                    <button
                      id="input-actions-dashboard-shortCode-button"
                      onClick={handleCreateShortUrl}
                    >
                      Shortn
                    </button>
                    <button
                      id="short-code-info-button"
                      onClick={cancelApplyCodeHandler}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {!shortCodeApplied && (
                  <>
                    <div className="edit-shortCode-container">
                      <input
                        type="text"
                        placeholder="Enter short code"
                        value={currentShortCode}
                        onChange={changeCodeHandler}
                      ></input>{" "}
                      <button
                        id="input-actions-dashboard-shortCode-button"
                        onClick={applyCodeHandler}
                      >
                        Apply Code
                      </button>
                      <button
                        id="short-code-info-button"
                        onClick={handleCreateShortUrl}
                      >
                        No thanks.
                      </button>
                    </div>
                    <h3 id="edit-shortCode">
                      Since you are a Pro customer you can choose your own custom short link.
                    </h3>
                  </>
                )}
              </div>
            )}

            <div className="created-links-dashboard">
              {myUrls.length > 0 &&  !urlStartedCreation &&
                myUrls
                  .slice(
                    0 + urlPerPage * selectedPage,
                    urlPerPage + urlPerPage * selectedPage
                  )
                  .map((url) => {
                    return (
                      <LinkItem
                        longUrl={url.longUrl}
                        shortUrl={url.shortUrl}
                        key={url.shortUrl}
                        onClickHandler={handleGetClickAnalytics}
                        onDeleteHandler={onDeleteHandler}
                        dark={props.dark}
                      ></LinkItem>
                    );
                  })}
              {myUrls.length > 3 && (
                <div className="dashboard-page-select">
                  <div className="button-page-select-dashboard">
                    <button onClick={prevPageHandler}><BsChevronDoubleLeft/></button>
                  </div>
                  <div className="page-identifier">
                    <h3>
                      Page {selectedPage + 1} of{" "}
                      {Math.ceil(myUrls.length / urlPerPage)}
                    </h3>
                  </div>
                  <div className="button-page-select-dashboard">
                    <button onClick={nextPageHandler}><BsChevronDoubleRight/></button>
                  </div>
                </div>
              )}
              {myUrls.length === 0 && !urlStartedCreation && (
                <div className="no-links-holder">
                  <h3>You haven't created any short link yet!</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import LinkItem from "../components/LinkItem";
import Services from "../services/Services";
import ErrorModal from "../components/ErrorModal";
import "./Dashboard.css";
import LinkStats from "./LinkStats";

const Dashboard = (props) => {
  const [myUrls, setUrls] = useState([]);
  const [currentLongUrl, changecurrentLongUrl] = useState("");
  const [errorState, displayErrorModal] = useState([]);
  const [selectedPage, selectPage] = useState(0);
  const [urlData,setUrlData] = useState();

  const urlPerPage = 3;

  useEffect(() => {
    const getUrls = async () => {
      let response = await Services.getUrls(props.userId);
      if (response.response === "ok") {
        setUrls(response.data);
      } else {
        setUrls([]);
      }
    };
    getUrls();
  }, []);

  const handleCreateShortUrl = async () => {
    const response = await Services.createShortLink(
      currentLongUrl,
      props.userId
    );
    changecurrentLongUrl("");
    if (response.response === "ok") {
      setUrls((prevUrls) => {
        let newUrls = [...prevUrls, response];
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

  const handleGetClickAnalytics = async (shortURL) => {
    const response = await Services.getStats(shortURL);
    if (response.response === "ok") {
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

  return (
    <>
      {errorState}
      {urlData && <LinkStats data={urlData? urlData:{}} shortUrl={"test"}></LinkStats>}
      <div className="main-dashboard-container">
        <div className="main-dashboard-content">
          <div className="main-content-dashboard">
            <h1 className="dasboard-title"><span>{props.username}'s</span> Dashboard</h1>
            <div className="input-actions-dashboard">
              <input
                type="text"
                placeholder="Enter your long url"
                value={currentLongUrl}
                onChange={changeHandler}
              ></input>{" "}
              <button onClick={handleCreateShortUrl}>Shortn</button>
            </div>
            <div className="created-links-dashboard">
              {myUrls.length > 0 &&
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
                        dark={props.dark}
                      ></LinkItem>
                    );
                  })}
              {myUrls.length > 3 && (
                <div className="dashboard-page-select">
                  <div className="button-page-select-dashboard">
                    <button onClick={prevPageHandler}>Prev.</button>
                  </div>
                  <div className="page-identifier">
                    <h3>
                      Page {selectedPage + 1} of{" "}
                      {Math.ceil(myUrls.length / urlPerPage)}
                    </h3>
                  </div>
                  <div className="button-page-select-dashboard">
                    <button onClick={nextPageHandler}>Next.</button>
                  </div>
                </div>
              )}
              {myUrls.length === 0 && (
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

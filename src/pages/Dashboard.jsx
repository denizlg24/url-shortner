import { useEffect, useState } from "react";
import LinkItem from "../components/LinkItem";
import Services from "../services/Services";
import ErrorModal from "../components/ErrorModal";
import "./Dashboard.css";

const Dashboard = (props) => {
  const [myUrls, setUrls] = useState([]);
  const [currentLongUrl, changecurrentLongUrl] = useState("");
  const [errorState, displayErrorModal] = useState([]);

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
        <ErrorModal title={response.response.status} errorDesc={response.response.data} cancelError={cancelError}></ErrorModal>
      ]);
    }
  };

  const handleGetClickAnalytics = async (shortURL) => {
    const response = await Services.getStats(shortURL);
    if (response.response === "ok") {
      console.log(response.data);
    } else {
      displayErrorModal([
        <ErrorModal title={response.response.status} errorDesc={response.response.data} cancelError={cancelError}></ErrorModal>
      ]);
    }
  };

  const changeHandler = (e) => {
    changecurrentLongUrl(e.target.value);
  };

  const cancelError = (e) =>{
    e.preventDefault();
    displayErrorModal([]);
  }

  return (
    <>
    {errorState}
    <div className="main-dashboard-container">
      <div className="main-dashboard-content">
        <div className="main-content-dashboard">
          <h1 className="dasboard-title">Dashboard</h1>
          <div className="input-actions-dashboard">
            <input
              type="text"
              placeholder="Enter your long url"
              value={currentLongUrl}
              onChange={changeHandler}
            ></input>{" "}
            <button onClick={handleCreateShortUrl}>Create Short URL</button>
          </div>
          <div className="created-links-dashboard">
            {myUrls.map((url) => {
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
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;

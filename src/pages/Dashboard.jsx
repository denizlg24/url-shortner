import { useEffect, useState } from "react";
import LinkItem from "../components/LinkItem";
import Services from "../services/Services";
import "./Dashboard.css";

const Dashboard = () => {
  const [myUrls, setUrls] = useState([]);
  const [currentLongUrl, changecurrentLongUrl] = useState("");

  useEffect(() =>{
    const jsonParse = localStorage.getItem('myLinks');
    if(!jsonParse){
      return;
    }
    const parsedArray = JSON.parse(jsonParse);
    setUrls(parsedArray);
  },[])


  const handleCreateShortUrl = async () => {
    const response = await Services.createShortLink(currentLongUrl);
    changecurrentLongUrl("");
    if (response.response === "ok") {
      setUrls((prevUrls) => {
        let newUrls = [...prevUrls, response];
        const jsonArray = JSON.stringify(newUrls);
        localStorage.setItem('myLinks', jsonArray);
        return newUrls;
      });
    }
    else{
      alert(response.response);
    }
  };

  const handleGetClickAnalytics = async (shortURL) => {
    const response = await Services.getStats(shortURL);
    if (response.response === "ok") {
      console.log(response.data);
    }
    else{
      alert(response.data);
    }
  };

  const changeHandler = (e) => {
    changecurrentLongUrl(e.target.value);
  };
  return (
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
                ></LinkItem>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

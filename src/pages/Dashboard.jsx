import { useEffect, useState } from "react";
import LinkItem from "../components/LinkItem";
import Services from "../services/Services";
import "./Dashboard.css";
import auth0 from "auth0-js";

const Dashboard = (props) => {
  const [myUrls, setUrls] = useState([]);
  const [currentLongUrl, changecurrentLongUrl] = useState("");

  useEffect(() => {
    var auth0Manage = new auth0.Management({
      domain: "dev-r8h4horutpz3j3g6.us.auth0.com",
      token: localStorage.getItem("accessToken"),
    });
    auth0Manage.getUser(props.userId, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        setUrls(user.user_metadata.links === "empty" ? [] : user.user_metadata.links);
      }
    });
  }, []);

  const handleCreateShortUrl = async () => {
    const response = await Services.createShortLink(currentLongUrl);
    changecurrentLongUrl("");
    if (response.response === "ok") {
      setUrls((prevUrls) => {
        let newUrls = [...prevUrls, response];
        var auth0Manage = new auth0.Management({
          domain: "dev-r8h4horutpz3j3g6.us.auth0.com",
          token: localStorage.getItem("accessToken"),
        });
        let userId = props.userId;
        let userMetadata = { links: newUrls };
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
        return newUrls;
      });
    } else {
      alert(response.response);
    }
  };

  const handleGetClickAnalytics = async (shortURL) => {
    const response = await Services.getStats(shortURL);
    if (response.response === "ok") {
      console.log(response.data);
    } else {
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

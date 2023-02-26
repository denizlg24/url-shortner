import { useState } from "react";
import { getStats, shortenURL } from "../services/Services";

const Dashboard = () => {
  const [shortUrl, setShortUrl] = useState("");
  const [clickAnalytics, setClickAnalytics] = useState({});

  const handleCreateShortUrl = async (longUrl) => {
    const newShortUrl = await shortenURL(longUrl);
    setShortUrl(newShortUrl);
  };

  const handleGetClickAnalytics = async (shortURL) => {
    const newClickAnalytics = await getStats(shortURL);
    setClickAnalytics(newClickAnalytics);
  };
  return (
    <div>
      <button onClick={() => handleCreateShortUrl("https://google.com")}>
        Create Short URL
      </button>
      <p>{shortUrl}</p>

      <button onClick={() => handleGetClickAnalytics("https://litz.in/fozTy6dNG")}>
        Get Click Analytics
      </button>
      <pre>{JSON.stringify(clickAnalytics, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;

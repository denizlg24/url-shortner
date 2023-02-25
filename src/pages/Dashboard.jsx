import { useState } from 'react';
import { createShortUrl, getClickAnalyticsByTime, getUserCreatedLinks } from '../services/Services';

const Dashboard = () => {
    const [shortUrl, setShortUrl] = useState('');
    const [clickAnalytics, setClickAnalytics] = useState({});
    const [userCreatedLinks, setUserCreatedLinks] = useState([]);
  
    const handleCreateShortUrl = async (longUrl) => {
      const newShortUrl = await createShortUrl(longUrl);
      setShortUrl(newShortUrl);
    }
  
    const handleGetClickAnalytics = async (bitlink) => {
      const newClickAnalytics = await getClickAnalyticsByTime(bitlink);
      setClickAnalytics(newClickAnalytics);
    }
  
    const handleGetUserCreatedLinks = async () => {
      const newUserCreatedLinks = await getUserCreatedLinks();
      setUserCreatedLinks(newUserCreatedLinks);
    }
    return (
      <div>
        <button onClick={() => handleCreateShortUrl('https://example.com')}>Create Short URL</button>
        <p>{shortUrl}</p>
  
        <button onClick={() => handleGetClickAnalytics('bit.ly/abc123')}>Get Click Analytics</button>
        <pre>{JSON.stringify(clickAnalytics, null, 2)}</pre>
  
        <button onClick={handleGetUserCreatedLinks}>Get User Created Links</button>
        <ul>
          {userCreatedLinks.map(link => (
            <li key={link.id}>{link.link}</li>
          ))}
        </ul>
      </div>
    );
  }

  export default Dashboard;
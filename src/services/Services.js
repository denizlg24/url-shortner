import axios from 'axios';

const BITLY_API_BASE_URL = 'https://api-ssl.bitly.com/v4';
const BITLY_CLIENT_ID = '6c66e457a9911901b29b05f8b2ec1ac01e0248e2';
const BITLY_CLIENT_SECRET = 'ebb2c559d9e98232f4b84117f44a7cfd318c575d';
const BITLY_REDIRECT_URI = 'https://url-shortner-denizlg24.vercel.app/?callback';

export const generateBitlyAccessToken = async (authorizationCode) => {
  try {
    const response = await axios.post('https://api-ssl.bitly.com/oauth/access_token', {
      client_id: BITLY_CLIENT_ID,
      client_secret: BITLY_CLIENT_SECRET,
      code: authorizationCode,
      redirect_uri: BITLY_REDIRECT_URI,
    });
    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error(error);
  }
}

const bitlyApi = axios.create({
  baseURL: BITLY_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAccessToken = (accessToken) => {
  bitlyApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

export const createShortUrl = async (longUrl) => {
  try {
    const response = await bitlyApi.post('/shorten', {
      long_url: longUrl
    });
    return response.data.link;
  } catch (error) {
    console.error(error);
  }
}

export const getClickAnalyticsByTime = async (bitlink) => {
  try {
    const response = await bitlyApi.get(`/bitlinks/${bitlink}/clicks/summary`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const getUserCreatedLinks = async () => {
  try {
    const response = await bitlyApi.get('/user/bitlinks');
    return response.data.links;
  } catch (error) {
    console.error(error);
  }
}
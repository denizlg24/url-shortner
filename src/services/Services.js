import axios from "axios";

export const shortenURL = async (longURL) => {
  const res = await axios.post(
    "https://url-shortner8.p.rapidapi.com/create-short-link",
    { longURL: longURL },
    {
      headers: {
        "X-RapidAPI-Key": "96cbeb50d5mshacecea5ab4716e1p113030jsn00c8cd8d32f5",
        "X-RapidAPI-Host": "url-shortner8.p.rapidapi.com",
      },
    }
  );
  console.log(res.data);
  return res.data.shortURL;
};

export const getStats = async (shortURL) => {
  const res = await axios.post(
    "https://url-shortner8.p.rapidapi.com/get-link-analytics",
    { shortURL: shortURL },
    {
      headers: {
        "X-RapidAPI-Key": "96cbeb50d5mshacecea5ab4716e1p113030jsn00c8cd8d32f5",
        "X-RapidAPI-Host": "url-shortner8.p.rapidapi.com",
      },
    }
  );

  console.log(res.data);
  return res.data;
};

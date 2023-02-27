import axios from "axios";

const Services = {};

Services.createShortLink = (longUrl) => {
  const data = {
    longUrl: longUrl,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios
    .post("https://shortn.at/api/url/shorten", data, config)
    .then((response) => {
      return { response: "ok", ...response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

Services.getStats = async (shortUrl) => {
  const data = {
    shortUrl: shortUrl,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios
    .post("https://shortn.at/api/url/stats", data, config)
    .then((response) => {
      return { response: "ok", data:response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

export default Services;

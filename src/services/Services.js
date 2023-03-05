import axios from "axios";

const Services = {};

Services.registerUser = (userData) => {
  const data = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios
    .post("https://shortn.at/api/auth/register", data, config)
    .then((response) => {
      return { response: "ok", ...response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

Services.loginUser = (userData) => {
  const data = {
    emailOrUsername: userData.emailOrUsername,
    password: userData.password,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios
    .post("https://shortn.at/api/auth/login", data, config)
    .then((response) => {
      return { response: "ok", ...response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

Services.validateToken = (accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return axios
    .get("https://shortn.at/api/auth/authenticate", config)
    .then((response) => {
      return { response: "ok", data:response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

Services.logoutUser = (accessToken) => {
  const data = {
    accessToken
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios
    .post("https://shortn.at/api/auth/logout", data, config)
    .then((response) => {
      return { response: "ok", ...response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};  



Services.createShortLink = (longUrl, userId) => {
  const data = {
    longUrl: longUrl,
    userId: userId,
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
      return { response: "ok", data: response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

Services.getUrls = async (userId) => {
  const data = {
    userId: userId,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  return axios
    .post("https://shortn.at/api/url/userUrl", data, config)
    .then((response) => {
      return { response: "ok", data: response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

export default Services;

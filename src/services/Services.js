import axios from "axios";

const Services = {};

Services.registerUser = (userData) => {
  const data = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    displayName: userData.displayName,
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
      return { response: "ok", data: response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

Services.logoutUser = (accessToken) => {
  const data = {
    accessToken,
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

Services.getPlan = async (accessToken) => {
  const data = {
    token: accessToken,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios
    .post("https://shortn.at/api/auth/subscription", data, config)
    .then((response) => {
      return { response: "ok", data: response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

// call this to Disable
Services.disableScroll = () => {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
};

// call this to Enable
Services.enableScroll = () => {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
};

export default Services;

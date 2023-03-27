import axios from "axios";

const Services = {};

Services.registerUser = async (userData) => {
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

  try {
    const response = await axios.post(
      "https://shortn.at/api/auth/register",
      data,
      config
    );
    return { response: "ok", ...response.data };
  } catch (error) {
    return { response: "failed", ...error };
  }
};

Services.loginUser = async (userData) => {
  const data = {
    emailOrUsername: userData.emailOrUsername,
    password: userData.password,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(
      "https://shortn.at/api/auth/login",
      data,
      config
    );
    return { response: "ok", ...response.data };
  } catch (error) {
    return { response: "failed", ...error };
  }
};

Services.validateToken = async (accessToken) => {
  const config = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  try {
    const response = await axios.get(
      "https://shortn.at/api/auth/authenticate",
      config
    );
    return { response: "ok", data: response.data };
  } catch (error) {
    return { response: "failed", ...error };
  }
};

Services.updateUserData = async (
  accessToken,
  newDisplayName,
  newEmail,
  newPassword,
  newImage,
  currentPassword
) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };
  const data = {
    token: accessToken,
    newDisplayName,
    newEmail,
    newPassword,
    newImage,
    currentPassword,
  };
  try {
    const response = await axios.post(
      "https://shortn.at/api/auth/user/update",
      data,
      config
    );
    window.location.replace("https://shortn.at");
    return { response: "ok", ...response.data };
  } catch (error) {
    return { response: "failed", ...error };
  }
};

Services.changeImage = async (file) => {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("token",localStorage.getItem("accessToken"));
  console.log(formData);
  axios
    .post("https://shortn.at/api/auth/user/update/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      window.location.replace("https://shortn.at");
      return { response: "ok", ...response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

Services.logoutUser = async (accessToken) => {
  const data = {
    accessToken,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(
      "https://shortn.at/api/auth/logout",
      data,
      config
    );
    return { response: "ok", ...response.data };
  } catch (error) {
    return { response: "failed", ...error };
  }
};

Services.createShortLink = async (longUrl, userId, customCode) => {
  const data = customCode
    ? {
        longUrl: longUrl,
        userId: userId,
        customCode,
      }
    : {
        longUrl: longUrl,
        userId: userId,
      };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(
      "https://shortn.at/api/url/shorten",
      data,
      config
    );
    return { response: "ok", ...response.data };
  } catch (error) {
    return { response: "failed", ...error };
  }
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

Services.removeLink = async (shortUrl) => {
  const data = {
    shortUrl,
  };

  const config = {
    "Content-Type": "application/json",
  };
  return axios
    .post("https://shortn.at/api/url/remove", data, config)
    .then((response) => {
      return { response: "ok", data: response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

Services.startResetFlow = async (email) => {
  const data = {
    email,
  };

  const config = {
    "Content-Type": "application/json",
  };
  return axios
    .post("https://shortn.at/api/auth/user/reset/password", data, config)
    .then((response) => {
      return { response: "ok", data: response.data };
    })
    .catch((error) => {
      return { response: "failed", ...error };
    });
};

Services.syncPasswordChange = async (bcryptPassword, resetToken) => {
  const data = {
    resetToken,
    bcryptPassword,
  };

  const config = {
    "Content-Type": "application/json",
  };
  return axios
    .post("https://shortn.at/api/auth/user/reset/sync", data, config)
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

Services.subscribeToPlan = async (lookUpKey, sub) => {
  const data = {
    lookup_key: lookUpKey,
    sub,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios
    .post(
      "https://shortn.at/api/subscription/create-checkout-session",
      data,
      config
    )
    .then((response) => {
      window.location.href = response.data.url;
    });
};

Services.upgradePlan = async (lookUpKey, sub) => {
  const data = {
    lookup_key: lookUpKey,
    sub,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios
    .post(
      "https://shortn.at/api/subscription/create-upgrade-session",
      data,
      config
    )
    .then((response) => {
      window.location.href = response.data.url;
    });
};

Services.managePlan = async (stripeId) => {
  const data = {
    stripeId,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios
    .post(
      "https://shortn.at/api/subscription/create-portal-session",
      data,
      config
    )
    .then((response) => {
      window.location.href = response.data.url;
    });
};

Services.contactHelp = async (name, fromEmail, message, sub) => {
  const data = {
    name,
    fromEmail,
    message,
    sub,
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios
    .post("https://shortn.at/api/contact/send", data, config)
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

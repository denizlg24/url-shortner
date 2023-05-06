import { useEffect, useState } from "react";
import LinkItem from "../components/LinkItem";
import Services from "../services/Services";
import ErrorModal from "../components/ErrorModal";
import "./Dashboard.css";
import LinkStats from "./LinkStats";
import {
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
  BsFillReplyFill,
} from "react-icons/bs";
import { QRCode } from "react-qrcode-logo";
import html2canvas from "html2canvas";
import axios from "axios";

const Dashboard = (props) => {
  const [myUrls, setUrls] = useState([]);
  const [myBioUrls, setBioUrls] = useState([]);
  const [currentLongUrl, changecurrentLongUrl] = useState("");
  const [currentShortCode, changecurrentShortCode] = useState("");
  const [shortCodeApplied, applyCode] = useState(false);
  const [errorState, displayErrorModal] = useState([]);
  const [selectedPage, selectPage] = useState(0);
  const [urlData, setUrlData] = useState();
  const [urlStartedCreation, starturlCreation] = useState(false);
  const [showingQrCode, showQrCode] = useState(false);
  const [currentImg, setFiles] = useState();
  const [qrCodeBgColor, setBgColor] = useState("#FFFFFF");
  const [qrCodeFgColor, setFgColor] = useState("#000000");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showingShortnEdit, showShortnEdit] = useState(false);
  const [editingData, setEditingData] = useState();
  const [editingShortCode, editShortCode] = useState("");
  const [editingLongUrl, editLongUrl] = useState("");
  const [bioHandle, changeBioHandle] = useState("");
  const [bioTitle, changeBioTitle] = useState("");
  const [bioDesc, changeBioDesc] = useState("");
  const [mainBgColor, changeMainBgColor] = useState("#222831");
  const [titleColor, changeTitleColor] = useState("#EEEEEE");
  const [linkBgColor, changeLinkBgColor] = useState("#8EA0E6");
  const [linkTextColor, changeLinkTextColor] = useState("#1f232a");
  const [iframeKey, setIframeKey] = useState("iframe_key=0");
  const [showingLinkInBioEdit, showLinkInBio] = useState(false);
  const [bioInfo, setBioInfo] = useState();
  const [bioLongLinkInput, changeBioLongLink] = useState("");
  const [bioUrlName, changeBioUrlName] = useState("");
  const [displayingAddLink, displayAddLink] = useState(false);
  const [bioLinkFile, setBioLinkFile] = useState();
  const [bioProfileFile, setBioProfileFile] = useState();
  const urlPerPage = 3;

  const getUrls = async () => {
    let response = await Services.getUrls(props.userId);
    if (response.response === "ok") {
      response.data.sort(function (a, b) {
        var keyA = new Date(a.date),
          keyB = new Date(b.date);
        // Compare the 2 dates
        if (keyA >= keyB) return -1;
        if (keyA < keyB) return 1;
      });
      setUrls(response.data);
      const numberOfPages = Math.ceil(response.data.length / urlPerPage);
      if (numberOfPages >= 2) {
        if (selectedPage >= numberOfPages) {
          selectPage(numberOfPages - 1);
        }
      } else {
        selectPage(0);
      }
    } else {
      setUrls([]);
    }
  };

  const getBioUrls = async () => {
    axios
      .get(`https://shortn.at/api/url/bio/info/${props.authData.sub}`)
      .then(async (response) => {
        setBioInfo(response.data);
        changeBioDesc(response.data.profileDesc);
        changeBioHandle(response.data.profileHandle);
        changeBioTitle(response.data.bioTitle);
        changeMainBgColor(response.data.mainBGColor);
        changeTitleColor(response.data.titleColor);
        changeLinkBgColor(response.data.linkBGColor);
        changeLinkTextColor(response.data.linkColor);
        const linkArr = await Promise.all(
          response.data.linkArray.map(async (linkObj) => {
            console.log(linkObj);
            const link = await axios.get(
              `https://shortn.at/api/url/${linkObj.shortCode}`
            );
            return link.data;
          })
        );
        setBioUrls((linkArr || []));
      });
  };

  useEffect(() => {
    getUrls();
  }, []);

  const changeBioInfo = async (m, t, l, lt, bt, bh, bd) => {
    let logoLink = "";
    if (bioProfileFile) {
      const response3 = await Services.changeImage(bioProfileFile, false);
      console.log(response3);
      if (response3.response != "ok") {
        displayErrorModal([
          <ErrorModal
            title={response3.response.status}
            errorDesc={response3.response.data}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
      logoLink = response3.data;
      setBioProfileFile();
    }
    axios
      .post(
        "https://shortn.at/api/url/bio/create",
        {
          mainBGColor: m,
          titleColor: t,
          linkColor: lt,
          linkBGColor: l,
          bioTitle: bt,
          displayName: bt,
          profileHandle: bh,
          profileDesc: bd,
          profilePicture: logoLink,
          sub: props.authData.sub,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(
        setTimeout(() => {
          setIframeKey((prev) => {
            const iter = parseInt(prev.split("=")[1]);
            return `iframe_key=${iter + 1}`;
          });
        }, 1500)
      );
  };

  const handleCreateShortUrl = async () => {
    const response = await Services.createShortLink(
      currentLongUrl,
      props.userId,
      applyCode ? currentShortCode : ""
    );
    if (response.response === "ok") {
      getUrls();
    } else {
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
    }
    cancelApplyCodeHandler();
  };

  const handleGetClickAnalytics = async (shortURL) => {
    const response = await Services.getStats(shortURL);
    if (response.response === "ok") {
      setUrlData(response.data);
    } else {
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
    }
  };

  const changeHandler = (e) => {
    changecurrentLongUrl(e.target.value);
  };

  const changeCodeHandler = (e) => {
    changecurrentShortCode(e.target.value);
  };

  const cancelError = (e) => {
    e.preventDefault();
    displayErrorModal([]);
  };

  const prevPageHandler = (e) => {
    e.preventDefault();
    selectPage((prevSelected) => {
      let numberOfPages = Math.ceil(myUrls.length / urlPerPage);
      if (prevSelected - 1 < 0) {
        return numberOfPages - 1;
      }
      return prevSelected - 1;
    });
  };

  const nextPageHandler = (e) => {
    e.preventDefault();
    selectPage((prevSelected) => {
      let numberOfPages = Math.ceil(myUrls.length / urlPerPage);
      if (prevSelected + 1 === numberOfPages) {
        return 0;
      }
      return prevSelected + 1;
    });
  };

  const cancelStatsPage = (e) => {
    e.preventDefault();

    setUrlData();
  };

  const onDeleteHandler = async (shortUrl) => {
    await Services.removeLink(shortUrl);
    await getBioUrls();
    await getUrls();
  };

  const applyCodeHandler = (e) => {
    if (!currentShortCode) {
      displayErrorModal([
        <ErrorModal
          title={"400"}
          errorDesc={"The short code cannot be empty!"}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      changecurrentShortCode("");
      return;
    }
    if (currentShortCode.trim().length <= 0) {
      displayErrorModal([
        <ErrorModal
          title={"400"}
          errorDesc={"The short code cannot be blank!"}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      changecurrentShortCode("");
      return;
    }
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(currentShortCode)) {
      displayErrorModal([
        <ErrorModal
          title={"400"}
          errorDesc={"The short code can only contain letters digits or '-_' !"}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      changecurrentShortCode("");
      return;
    }
    applyCode(true);
  };

  const cancelApplyCodeHandler = (e) => {
    changecurrentShortCode("");
    changecurrentLongUrl("");
    starturlCreation(false);
    applyCode(false);
  };

  const handleStartShortCodeCreation = (e) => {
    starturlCreation(true);
  };

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  const qrCodeHandler = async (e) => {
    await delay(1);
    html2canvas(document.getElementById("react-qrcode-logo"), {
      allowTaint: true,
      useCORS: true,
    }).then(function (canvas) {
      const link = document.createElement("a");
      link.download = `${qrCodeUrl}_QRCODE.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  const onClickQrCodeHandler = (sUrl) => {
    setQrCodeUrl(sUrl.slice(18));
    showQrCode(true);
  };
  const onClickEditHandler = async (sUrl) => {
    setQrCodeUrl(sUrl);
    const response = await Services.getLong(sUrl.slice(18));
    if (response.response === "ok") {
      setEditingData({
        shortUrl: sUrl,
        shortCode: sUrl.slice(18),
        longUrl: response.data.longUrl,
      });
      showShortnEdit(true);
    } else {
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
    }
  };

  const updateShortnHandler = async (sUrl) => {
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (editingShortCode && !regex.test(editingShortCode)) {
      displayErrorModal([
        <ErrorModal
          title={"400"}
          errorDesc={"The short code can only contain letters digits or '-_' !"}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      editShortCode("");
      return;
    }
    const response = await Services.updateShortn(
      sUrl.slice(18),
      editingShortCode,
      editingLongUrl,
      props.authData.sub
    );
    if (response.response === "ok") {
      editShortCode("");
      editLongUrl("");
      showShortnEdit(false);
      getUrls();
      getBioUrls();
    } else {
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
    }
  };

  return (
    <>
      {showingLinkInBioEdit && (
        <div className="main-error-modal">
          <div
            className="main-stats-container"
            style={{
              backgroundColor: "var(--color-backgroundSecondary)",
              paddingBottom: "1rem",
            }}
          >
            <button
              className="close-modal"
              onClick={() => {
                showLinkInBio(false);
              }}
              style={{
                filter: props.dark
                  ? "invert(91%) sepia(99%) saturate(34%) hue-rotate(254deg) brightness(106%) contrast(100%)"
                  : "",
              }}
            >
              <img src="https://img.icons8.com/ios-glyphs/30/null/macos-close.png" />
            </button>
            <div className="title-holder-stats">
              <h2>Link in Bio Editor</h2>
            </div>
            <div className="linkinbio-holder">
              <div className="linkinbio-input">
                <input
                  type="color"
                  name="mainBgColor"
                  id="mainBgColor"
                  value={mainBgColor}
                  onChange={(e) => {
                    changeMainBgColor(e.target.value);
                  }}
                />
                <h3>Background Color</h3>
              </div>
              <div className="linkinbio-input">
                <input
                  type="color"
                  name="titleColor"
                  id="titleColor"
                  value={titleColor}
                  onChange={(e) => {
                    changeTitleColor(e.target.value);
                  }}
                />
                <h3>Title Text Color</h3>
              </div>
              <div className="linkinbio-input">
                <input
                  type="color"
                  name="linkBgColor"
                  id="linkBgColor"
                  value={linkBgColor}
                  onChange={(e) => {
                    changeLinkBgColor(e.target.value);
                  }}
                />
                <h3>Link Background Color</h3>
              </div>
              <div className="linkinbio-input">
                <input
                  type="color"
                  name="linkTextColor"
                  id="linkTextColor"
                  value={linkTextColor}
                  onChange={(e) => {
                    changeLinkTextColor(e.target.value);
                  }}
                />
                <h3>Link Text Color</h3>
              </div>
              <div className="linkinbio-input">
                <input
                  type="text"
                  value={bioTitle}
                  onChange={(e) => {
                    changeBioTitle(e.target.value);
                  }}
                />
                <h3>Page Title</h3>
              </div>
              <div className="linkinbio-input">
                <input
                  type="text"
                  value={bioHandle}
                  onChange={(e) => {
                    changeBioHandle(e.target.value);
                  }}
                />
                <h3>Bio Handle (unique)</h3>
              </div>
              <div className="linkinbio-input">
                <input
                  type="text"
                  value={bioDesc}
                  onChange={(e) => {
                    changeBioDesc(e.target.value);
                  }}
                />
                <h3>Bio Description</h3>
              </div>
            </div>
            <h3 style={{margin:"1rem",marginBottom:"0",color:"var(--color-text)"}}>Bio Icon</h3>
            <div className="logo-input-holder">
              <input
                type="file"
                onChange={(e) => {
                  setBioProfileFile(e.target.files[0]);
                }}
                style={{ color: "var(--color-text)" }}
              />
            </div>
            <button
              onClick={() => {
                getBioUrls();
                showLinkInBio(false);
                displayAddLink(true);
              }}
              className="link-in-bio-button2"
            >
              Bio Links
            </button>
            <button
              className="link-in-bio-button3"
              onClick={() => {
                changeBioInfo(
                  mainBgColor,
                  titleColor,
                  linkBgColor,
                  linkTextColor,
                  bioTitle,
                  bioHandle,
                  bioDesc
                );
                setTimeout(() => {
                  axios
                    .get(
                      `https://shortn.at/api/url/bio/info/${props.authData.sub}`
                    )
                    .then((response) => {
                      console.log(response.data);
                      setBioInfo(response.data);
                      changeBioDesc(response.data.profileDesc);
                      changeBioHandle(response.data.profileHandle);
                      changeBioTitle(response.data.bioTitle);
                      changeMainBgColor(response.data.mainBGColor);
                      changeTitleColor(response.data.titleColor);
                      changeLinkBgColor(response.data.linkBGColor);
                      changeLinkTextColor(response.data.linkColor);
                      showLinkInBio(true);
                    });
                }, 2000);
              }}
            >
              Update
            </button>
            <div className="title-holder-stats" style={{ marginTop: "1rem" }}>
              <h2>Preview</h2>
              <a
                href={`https://shortn.at/u/${bioInfo.profileHandle}`}
              >{`https://shortn.at/u/${bioInfo.profileHandle}`}</a>
            </div>
            <iframe
              style={{
                width: "100%",
                minHeight: "200px",
                border: "3px dashed red",
              }}
              key={iframeKey}
              src={`https://shortn.at/u/${bioInfo.profileHandle}`}
              title={bioInfo.bioTitle}
            ></iframe>
          </div>
        </div>
      )}
      {displayingAddLink && (
        <div className="main-error-modal">
          <div
            className="main-stats-container"
            style={{
              backgroundColor: "var(--color-backgroundSecondary)",
              paddingBottom: "1rem",
            }}
          >
            <button
              className="close-modal"
              onClick={() => {
                displayAddLink(false);
                showLinkInBio(true);
                changeBioInfo(
                  mainBgColor,
                  titleColor,
                  linkBgColor,
                  linkTextColor,
                  bioTitle,
                  bioHandle,
                  bioDesc
                );
                setTimeout(() => {
                  axios
                    .get(
                      `https://shortn.at/api/url/bio/info/${props.authData.sub}`
                    )
                    .then((response) => {
                      setBioInfo(response.data);
                      changeBioDesc(response.data.profileDesc);
                      changeBioHandle(response.data.profileHandle);
                      changeBioTitle(response.data.bioTitle);
                      changeMainBgColor(response.data.mainBGColor);
                      changeTitleColor(response.data.titleColor);
                      changeLinkBgColor(response.data.linkBGColor);
                      changeLinkTextColor(response.data.linkColor);
                    });
                }, 2000);
              }}
              style={{
                filter: props.dark
                  ? "invert(91%) sepia(99%) saturate(34%) hue-rotate(254deg) brightness(106%) contrast(100%)"
                  : "",
              }}
            >
              <img src="https://img.icons8.com/ios-glyphs/30/null/macos-close.png" />
            </button>
            <div className="title-holder-stats">
              <h2>Bio Links</h2>
            </div>
            <div className="add-link-in-bio-holder">
              <h3>Long Link</h3>
              <input
                type="text"
                value={bioLongLinkInput}
                onChange={(e) => {
                  changeBioLongLink(e.target.value);
                }}
              />
              <h3>Link Name</h3>
              <input
                type="text"
                value={bioUrlName}
                onChange={(e) => {
                  changeBioUrlName(e.target.value);
                }}
              />
              <h3>Link Icon</h3>
              <div className="logo-input-holder">
                <input
                  type="file"
                  onChange={(e) => {
                    setBioLinkFile(e.target.files[0]);
                  }}
                  style={{ color: "var(--color-text)" }}
                />
              </div>
            </div>
            <button
              className="link-in-bio-button3"
              onClick={async () => {
                let logoLink = "";
                if (bioLinkFile) {
                  const response3 = await Services.changeImage(
                    bioLinkFile,
                    false
                  );
                  console.log(response3);
                  if (response3.response != "ok") {
                    displayErrorModal([
                      <ErrorModal
                        title={response3.response.status}
                        errorDesc={response3.response.data}
                        cancelError={cancelError}
                      ></ErrorModal>,
                    ]);
                    return;
                  }
                  logoLink = response3.data;
                }

                const response = await Services.createShortLink(
                  bioLongLinkInput,
                  props.authData.sub
                );
                if (response.response === "ok") {
                  const data = {
                    sub: props.authData.sub,
                    shortCode: response.urlCode,
                    name: bioUrlName,
                    logo: logoLink,
                  };
                  const config = {
                    "Content-Type": "application/json",
                  };
                  const response2 = await axios.post(
                    "https://shortn.at/api/url/bio/urls",
                    data,
                    config
                  );
                  getBioUrls();
                  changeBioLongLink("");
                  changeBioUrlName("");
                  setBioLinkFile();
                } else {
                  displayErrorModal([
                    <ErrorModal
                      title={response.response.status}
                      errorDesc={response.response.data}
                      cancelError={cancelError}
                    ></ErrorModal>,
                  ]);
                }
              }}
            >
              Add Link
            </button>
            <h3 style={{ color: "var(--color-text)", margin: "1rem" }}>
              Link List
            </h3>
            {myBioUrls?.length > 0 &&
              myBioUrls.map((urlArray) => {
                const url = urlArray[0];
                return (
                  <LinkItem
                    longUrl={url.longUrl}
                    shortUrl={url.shortUrl}
                    key={url.shortUrl}
                    onClickHandler={handleGetClickAnalytics}
                    onDeleteHandler={onDeleteHandler}
                    onClickQrCodeHandler={onClickQrCodeHandler}
                    onClickEditHandler={onClickEditHandler}
                    dark={props.dark}
                    myPlan={props.myPlan}
                  ></LinkItem>
                );
              })}
            {(!myBioUrls || myBioUrls?.length === 0) && (
              <div className="no-links-holder">
                <h3>You haven't created any bio link yet!</h3>
              </div>
            )}
          </div>
        </div>
      )}
      {showingQrCode && (
        <div className="main-error-modal">
          <div
            className="main-stats-container"
            style={{
              backgroundColor: "var(--color-backgroundSecondary)",
              paddingBottom: "1rem",
            }}
          >
            <button
              className="close-modal"
              onClick={() => {
                showQrCode(false);
              }}
              style={{
                filter: props.dark
                  ? "invert(91%) sepia(99%) saturate(34%) hue-rotate(254deg) brightness(106%) contrast(100%)"
                  : "",
              }}
            >
              <img src="https://img.icons8.com/ios-glyphs/30/null/macos-close.png" />
            </button>
            <div className="title-holder-stats">
              <h2>QR Code Generator</h2>
            </div>
            <div className="qr-code-preview-holder">
              {
                <QRCode
                  value={`https://shortn.at/${qrCodeUrl}`}
                  ecLevel={"M"}
                  size={500}
                  logoImage={currentImg}
                  removeQrCodeBehindLogo={true}
                  logoPadding={5}
                  logoWidth={100}
                  bgColor={qrCodeBgColor}
                  fgColor={qrCodeFgColor}
                  logoPaddingStyle={"circle"}
                />
              }
            </div>
            <div className="qr-code-settings">
              <div className="logo-input-holder">
                <h3>Choose QR Code Logo</h3>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files.length > 0)
                      toBase64(e.target.files[0]).then((value) =>
                        setFiles(value)
                      );
                    else setFiles();
                  }}
                />
              </div>
              <div className="color-input-holder">
                <h3>Choose Colors</h3>
                <div className="color-color-input-hodler">
                  <div className="first-color">
                    <input
                      type="color"
                      id="background-color"
                      value={qrCodeBgColor}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                      }}
                    />
                    <label htmlFor="background-color">Background</label>
                  </div>
                  <div className="second-color">
                    <input
                      type="color"
                      id="foreground-color"
                      value={qrCodeFgColor}
                      onChange={(e) => {
                        setFgColor(e.target.value);
                      }}
                    />
                    <label htmlFor="foreground-color">Foreground</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="link-actions">
              <button onClick={qrCodeHandler} id="download-btn-qrcode">
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}
      {showingShortnEdit && (
        <div className="main-error-modal">
          <div
            className="main-stats-container"
            style={{
              backgroundColor: "var(--color-backgroundSecondary)",
              paddingBottom: "1rem",
            }}
          >
            <button
              className="close-modal"
              onClick={() => {
                showShortnEdit(false);
              }}
              style={{
                filter: props.dark
                  ? "invert(91%) sepia(99%) saturate(34%) hue-rotate(254deg) brightness(106%) contrast(100%)"
                  : "",
              }}
            >
              <img src="https://img.icons8.com/ios-glyphs/30/null/macos-close.png" />
            </button>
            <div className="title-holder-stats">
              <h2>Edit Shortn Link</h2>
            </div>
            <div className="long-url-editor">
              <h3>Update long url</h3>
              <input
                type="text"
                placeholder={editingData?.longUrl}
                value={editingLongUrl}
                onChange={(e) => {
                  editLongUrl(e.target.value);
                }}
              />
            </div>
            <div className="short-url-editor">
              <h3>Update short url</h3>
              <div className="short-url-input-part">
                <h4>https://shortn.at/</h4>
                <input
                  type="text"
                  placeholder={editingData?.shortCode}
                  value={editingShortCode}
                  onChange={(e) => {
                    editShortCode(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="link-actions">
              <button
                onClick={() => {
                  updateShortnHandler(editingData?.shortUrl);
                }}
                id="download-btn-qrcode"
              >
                Update Shortn
              </button>
            </div>
          </div>
        </div>
      )}
      {urlData && (
        <LinkStats
          data={urlData.clicks}
          myPlan={props.myPlan}
          shortUrl={urlData.shortUrl}
          sub={urlData.userId}
          shortCode={urlData.urlCode}
          lastClicked={urlData.clicks.lastClick}
          dark={props.dark}
          closeStats={cancelStatsPage}
          authData={props.authData}
        ></LinkStats>
      )}
      {errorState}
      <div className="main-dashboard-container">
        <div className="main-dashboard-content">
          <div className="back-home-dashboard" onClick={props.home}>
            <BsFillReplyFill />
            <p>Home</p>
          </div>
          <div className="main-content-dashboard">
            <h1 className="dasboard-title">
              <span>{props.username}'s</span> Dashboard
            </h1>
            {!urlStartedCreation && (
              <div className="input-actions-dashboard">
                <input
                  type="text"
                  placeholder="Enter your long url"
                  value={currentLongUrl}
                  onChange={changeHandler}
                ></input>{" "}
                <button
                  onClick={
                    props.myPlan === "pro"
                      ? handleStartShortCodeCreation
                      : handleCreateShortUrl
                  }
                >
                  Shortn
                </button>
              </div>
            )}
            {props.myPlan === "pro" && urlStartedCreation && (
              <div id="input-actions-dashboard-shortCode">
                {shortCodeApplied && (
                  <div className="short-code-info-container">
                    <h3>
                      Your link will look like:{" "}
                      <span>shortn.at/{currentShortCode}</span>
                    </h3>
                    <button
                      id="input-actions-dashboard-shortCode-button"
                      onClick={handleCreateShortUrl}
                    >
                      Shortn
                    </button>
                    <button
                      id="short-code-info-button"
                      onClick={cancelApplyCodeHandler}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {!shortCodeApplied && (
                  <>
                    <div className="edit-shortCode-container">
                      <input
                        type="text"
                        placeholder="Enter short code"
                        value={currentShortCode}
                        onChange={changeCodeHandler}
                      ></input>{" "}
                      <button
                        id="input-actions-dashboard-shortCode-button"
                        onClick={applyCodeHandler}
                      >
                        Apply Code
                      </button>
                      <button
                        id="short-code-info-button"
                        onClick={handleCreateShortUrl}
                      >
                        No thanks.
                      </button>
                    </div>
                    <h3 id="edit-shortCode">
                      Since you are a Pro customer you can choose your own
                      custom short link.
                    </h3>
                  </>
                )}
              </div>
            )}
            {props.myPlan === "pro" && (
              <button
                className="link-in-bio-button"
                onClick={() => {
                  axios
                    .get(
                      `https://shortn.at/api/url/bio/info/${props.authData.sub}`
                    )
                    .then((response) => {
                      setBioInfo(response.data);
                      changeBioDesc(response.data.profileDesc);
                      changeBioHandle(response.data.profileHandle);
                      changeBioTitle(response.data.bioTitle);
                      changeMainBgColor(response.data.mainBGColor);
                      changeTitleColor(response.data.titleColor);
                      changeLinkBgColor(response.data.linkBGColor);
                      changeLinkTextColor(response.data.linkColor);
                      showLinkInBio(true);
                    });
                }}
              >
                Link in Bio
              </button>
            )}
            <div className="created-links-dashboard">
              {myUrls.length > 0 &&
                !urlStartedCreation &&
                myUrls
                  .slice(
                    0 + urlPerPage * selectedPage,
                    urlPerPage + urlPerPage * selectedPage
                  )
                  .map((url) => {
                    return (
                      <LinkItem
                        longUrl={url.longUrl}
                        shortUrl={url.shortUrl}
                        key={url.shortUrl}
                        onClickHandler={handleGetClickAnalytics}
                        onDeleteHandler={onDeleteHandler}
                        onClickQrCodeHandler={onClickQrCodeHandler}
                        onClickEditHandler={onClickEditHandler}
                        dark={props.dark}
                        myPlan={props.myPlan}
                      ></LinkItem>
                    );
                  })}
              {myUrls.length > 3 && (
                <div className="dashboard-page-select">
                  <div className="button-page-select-dashboard">
                    <button onClick={prevPageHandler}>
                      <BsChevronDoubleLeft />
                    </button>
                  </div>
                  <div className="page-identifier">
                    <h3>
                      Page {selectedPage + 1} of{" "}
                      {Math.ceil(myUrls.length / urlPerPage)}
                    </h3>
                  </div>
                  <div className="button-page-select-dashboard">
                    <button onClick={nextPageHandler}>
                      <BsChevronDoubleRight />
                    </button>
                  </div>
                </div>
              )}
              {myUrls.length === 0 && !urlStartedCreation && (
                <div className="no-links-holder">
                  <h3>You haven't created any short link yet!</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

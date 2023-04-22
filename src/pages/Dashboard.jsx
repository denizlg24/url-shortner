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

const Dashboard = (props) => {
  const [myUrls, setUrls] = useState([]);
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

  useEffect(() => {
    getUrls();
  }, []);

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
      editingLongUrl
    );
    if (response.response === "ok") {
      editShortCode("");
      editLongUrl("");
      showShortnEdit(false);
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
  };

  return (
    <>
      {errorState}
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

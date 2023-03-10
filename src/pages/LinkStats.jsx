import { useState } from "react";
import questionMarkIcon from "../assets/icons8-question-mark-90.png";
import ProDashboard from "./ProDashboard";
import "./LinkStats.css";

const LinkStats = (props) => {


  const getDateInFormat = (dateIn) => {
    var date = new Date(dateIn);
    var dateStr =
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("00" + date.getDate()).slice(-2) +
      "/" +
      date.getFullYear() +
      " " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2);
    return dateStr;
  };
  return (
    <div className="main-error-modal">
      <div className="main-stats-container">
        <button
          className="close-modal"
          onClick={props.closeStats}
          style={{
            filter: props.dark
              ? "invert(91%) sepia(99%) saturate(34%) hue-rotate(254deg) brightness(106%) contrast(100%)"
              : "",
          }}
        >
          <img src="https://img.icons8.com/ios-glyphs/30/null/macos-close.png" />
        </button>
        <div className="title-holder-stats">
          <h2>
            Stats for{" "}
            <a href={props.shortUrl} target="_blank">
              {props.shortUrl.slice(8)}
            </a>
          </h2>
        </div>
        <div className="short-info">
          <h3>
            Total Clicks:{" "}
            <span>
              {"total" in props.data ? props.data.total : "Upgrade Plan!"}
            </span>
          </h3>
          <h3>
            Last Clicked:{" "}
            <span>
              {props.lastClicked !== "Never"
                ? getDateInFormat(props.lastClicked)
                : props.lastClicked}
            </span>
          </h3>
        </div>
        {/*(props.myPlan === "pro" || props.myPlan === "plus") && <ProDashboard data={props.data}></ProDashboard>*/}
        {props.myPlan === "pro" && <ProDashboard data={props.data} dark={props.dark}></ProDashboard>}
      </div>
    </div>
  );
};
export default LinkStats;

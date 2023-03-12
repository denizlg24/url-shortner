import { useState } from "react";
import questionMarkIcon from '../assets/icons8-question-mark-90.png'
import "./LinkStats.css";

const LinkStats = (props) => {
  const [filterUp, toggleFilter] = useState(true);
  const countries = Object.entries(props.data.byCountry);
  const sortedData = filterUp ? countries.sort((a, b) => b[1] - a[1]) : countries.sort((a, b) => a[1] - b[1])
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
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
            Total Clicks: <span>{props.data.total}</span>
          </h3>
          <h3>
            Last Clicked: <span>{props.lastClicked !== "Never" ? getDateInFormat(props.lastClicked) : props.lastClicked}</span>
          </h3>
        </div>
        <div className="countries-info">
          <div className="sorting-countries-container">
            <div className="displaying-x-countries">
              {countries.length > 0 ? (
                <h3>
                  Displaying <span>{countries.length}</span>{" "}
                  {countries.length > 1 ? "countries" : "country"}
                </h3>
              ) : (
                <h3>
                  No countries to display.
                </h3>
              )}
            </div>
            <div className="filter-countries">
              <h3>Sort</h3>
              <button
                onClick={() => {
                  toggleFilter((prevState) => !prevState);
                }}
              >
                <img
                  style={{
                    filter: props.dark
                      ? "invert(91%) sepia(99%) saturate(34%) hue-rotate(254deg) brightness(106%) contrast(100%)"
                      : "",
                  }}
                  src={
                    filterUp
                      ? "https://img.icons8.com/material/24/null/sort-down--v2.png"
                      : "https://img.icons8.com/material/24/null/sort-up--v2.png"
                  }
                  alt="Sort Button"
                />
              </button>
            </div>
          </div>
          <ul>
            {sortedData.map((country) => {
              return (
                <li key={country[0]}>
                  <h1>
                    {country[0] !== "Other" ? regionNames.of(country[0]) : "Other"}
                    <img
                      src={country[0] !== "Other" ? `https://flagcdn.com/w160/${country[0].toLowerCase()}.png` : questionMarkIcon}
                      alt={country[0] !== "Other" ? regionNames.of(country[0]) + "'s flag" : "Question Mark Icon"}
                    />
                  </h1>
                  <p>
                    Clicks: <span>{country[1]}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default LinkStats;

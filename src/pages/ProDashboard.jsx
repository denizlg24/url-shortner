import { useState } from "react";
import "./Dashboard.css";

const ProDashboard = (props) => {
  const [filterUp, toggleFilter] = useState(true);
  const [proTab, selectProTab] = useState(0);
  const countries = Object.entries(props.data.byCountry);
  const sortedCountries = filterUp
    ? countries.sort((a, b) => b[1] - a[1])
    : countries.sort((a, b) => a[1] - b[1]);
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const times = Object.entries(props.data.byTimeOfDay);
  const sortedTimes = filterUp
    ? times.sort((a, b) => b[1] - a[1])
    : times.sort((a, b) => a[1] - b[1]);
  return (
    <>
      <div className="page-select-pro-dashboard">
        <h2>Select Stats</h2>
        <div className="page-select-pro-content">
          <span className="page-select-pro-item">
            <button
              id={proTab === 0 ? "selected" : ""}
              onClick={() => {
                selectProTab(0);
              }}
            >
              Geo Data
            </button>
          </span>
          <span className="page-select-pro-item">
            <button
              id={proTab === 1 ? "selected" : ""}
              onClick={() => {
                selectProTab(1);
              }}
            >
              Time Data
            </button>
          </span>
          <span className="page-select-pro-item">
            <button
              id={proTab === 2 ? "selected" : ""}
              onClick={() => {
                selectProTab(2);
              }}
            >
              Hardware Data
            </button>
          </span>
        </div>
      </div>
      {proTab === 1 && (
        <div className="countries-info">
          <div className="sorting-countries-container">
            <div className="displaying-x-countries">
              {(!times ? 0 : times.length) > 0 ? (
                <h3>
                  Displaying <span>{times.length}</span>{" "}
                  {times.length > 1 ? "times" : "time"}
                </h3>
              ) : (
                <h3>No time intervals to display.</h3>
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
            {sortedTimes.map((time) => {
              return (
                <li key={time[0]}>
                  <h1>{"["+time[0]+", " + ((+time[0]+1)%24) + "["}</h1>
                  <p>
                    Clicks: <span>{time[1]}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {proTab === 0 && (
        <div className="countries-info">
          <div className="sorting-countries-container">
            <div className="displaying-x-countries">
              {countries.length > 0 ? (
                <h3>
                  Displaying <span>{countries.length}</span>{" "}
                  {countries.length > 1 ? "countries" : "country"}
                </h3>
              ) : (
                <h3>No countries to display.</h3>
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
            {sortedCountries.map((country) => {
              return (
                <li key={country[0]}>
                  <h1>
                    {country[0]}
                    <img
                      src={
                        country[0] !== "Other"
                          ? `https://flagcdn.com/w160/${country[0].toLowerCase()}.png`
                          : questionMarkIcon
                      }
                      alt={
                        country[0] !== "Other"
                          ? regionNames.of(country[0]) + "'s flag"
                          : "Question Mark Icon"
                      }
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
      )}
    </>
  );
};

export default ProDashboard;

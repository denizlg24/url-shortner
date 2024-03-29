import React, { Component, PureComponent } from "react";
import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Services from "../services/Services";
import ErrorModal from "../components/ErrorModal";

const ProDashboard = (props) => {
  //const [filterUp, toggleFilter] = useState(true);
  const [proTab, selectProTab] = useState(0);
  const [advancedTab, selectAdvancedTab] = useState(0);
  const [lineBarTickCount, toggleSize] = useState(24);
  const [errorState, displayErrorModal] = useState([]);
  const cancelError = (e) => {
    displayErrorModal([]);
    return;
  };

  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const hours = Math.floor(label);
      const minutes = Math.round((label - hours) * 60);
      const formattedTime = hours + ":" + (minutes < 10 ? "0" : "") + minutes;
      return (
        <div className="custom-tooltip">
          <p className="label">Time: {formattedTime}</p>
          <p className="intro">
            Clicks: <span>{payload[0].value}</span>
          </p>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    function handleResize() {
      toggleSize(window.innerWidth < 600 ? 12 : 24);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  const rawCountryData = props.data.byCountry;
  const countryData = rawCountryData.map((countryObject) => {
    return {
      ...countryObject,
      value: 1,
    };
  });
  const groupedCountryData = countryData.reduce((acc, curr) => {
    const index = acc.findIndex(
      (item) => item.ll[0] === curr.ll[0] && item.ll[1] === curr.ll[1]
    );
    if (index !== -1) {
      acc[index].value += curr.value;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);
  const markers = groupedCountryData.map((click) => {
    if (click.ll) {
      return (
        <Marker
          key={[click.ll[0], click.ll[1]]}
          position={[click.ll[0], click.ll[1]]}
        >
          <Popup>
            {click.moreInfo && (
              <>
                {click.moreInfo[0].city +
                  ", " +
                  regionNames.of(click.moreInfo[0].countryCode)}{" "}
                <br /> {"Clicks: " + click.value}
              </>
            )}
            {!click.moreInfo && (
              <>
                {click.city + ", " + regionNames.of(click.country)} <br />{" "}
                {"Clicks: " + click.value}
              </>
            )}
          </Popup>
        </Marker>
      );
    }
  });

  const times = [];
  for (let i = 0; i < 25; i++) {
    times.push({
      time: i,
      value: 0,
    });
  }
  props.data.byTimeOfDay.forEach((item) => {
    let time =
      parseInt(item.split(":")[0]) +
      parseFloat((parseInt(item.split(":")[1]) / 60).toFixed(2));
    const i = times.findIndex((e) => e.time === time);
    if (i > -1) {
      times[i].value += 1;
    } else {
      times.push({
        time: time,
        value: 1,
      });
    }
  });
  times.sort(function (a, b) {
    if (a.time <= b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });

  const rawData = props.data.devices;
  const browserData = rawData.map((item) => {
    return {
      name: item.client.name,
      value: 1,
    };
  });
  const groupedBrowserData = browserData.reduce((acc, curr) => {
    const index = acc.findIndex((item) => item.name === curr.name);
    if (index !== -1) {
      acc[index].value += curr.value;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  const osData = rawData.map((item) => {
    return {
      name:
        item.os.name +
        " " +
        (item.os.platform ? item.os.platform : item.os.version),
      value: 1,
    };
  });
  const groupedOsData = osData.reduce((acc, curr) => {
    const index = acc.findIndex((item) => item.name === curr.name);
    if (index !== -1) {
      acc[index].value += curr.value;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  const capitalize = (str) => {
    if (!str) {
      return;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const deviceData = rawData.map((item) => {
    const brand = capitalize(item.device.brand);
    const model = capitalize(item.device.model);
    const type = capitalize(item.device.type);
    let returnName = "Other";
    if (brand && model) {
      returnName = brand + " " + model;
    } else if (brand && type) {
      returnName = brand + " " + type;
    } else if (model) {
      returnName = model;
    } else if (type) {
      returnName = type;
    }
    return {
      name: returnName,
      value: 1,
    };
  });
  const groupedDeviceData = deviceData.reduce((acc, curr) => {
    const index = acc.findIndex((item) => item.name === curr.name);
    if (index !== -1) {
      acc[index].value += curr.value;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  const browserBarColors = [
    "var(--color-lightSpecial)",
    "var(--color-darkSpecial)",
  ];

  const osBarColors = ["var(--color-lightAccent)", "var(--color-darkAccent)"];
  class CustomizedAxisTick extends PureComponent {
    render() {
      const { x, y, payload } = this.props;
      const maxWidth = 1;
      const words = payload.value.split(" ");
      const lines = [];
      let currentLine = "";

      words.forEach((word) => {
        if (currentLine.length + word.length > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine += word;
        }
      });
      lines.push(currentLine);

      return (
        <text
          x={x}
          y={y}
          width={maxWidth}
          textAnchor="middle"
          style={{ fontSize: ".75rem" }}
          fill={"var(--color-text)"}
        >
          {lines.map((line, index) =>
            index === 0 ? (
              <tspan textAnchor="middle" x={x} y={y + 15} key={index}>
                {line}
              </tspan>
            ) : (
              <tspan textAnchor="middle" x={x} y={y + index * 15} key={index}>
                {line}
              </tspan>
            )
          )}
        </text>
      );
    }
  }

  const downloadStatsHandler = async (e) => {
    const response = await Services.downloadStats(props.sub, props.shortCode);
    console.log(response);
    if ("status" in response.response) {
      displayErrorModal([
        <ErrorModal
          title={response.response.status}
          errorDesc={response.response.data}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      return;
    }
  };

  return (
    <>
      {errorState}
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
              System Data
            </button>
          </span>
        </div>
        {proTab === 2 && (
          <div className="page-select-pro-content">
            <span className="page-select-pro-item">
              <button
                id={advancedTab === 0 ? "selected" : ""}
                onClick={() => {
                  selectAdvancedTab(0);
                }}
              >
                Browser Data
              </button>
            </span>
            <span className="page-select-pro-item">
              <button
                id={advancedTab === 1 ? "selected" : ""}
                onClick={() => {
                  selectAdvancedTab(1);
                }}
              >
                Operating System Data
              </button>
            </span>
            <span className="page-select-pro-item">
              <button
                id={advancedTab === 2 ? "selected" : ""}
                onClick={() => {
                  selectAdvancedTab(2);
                }}
              >
                Device Data
              </button>
            </span>
          </div>
        )}
      </div>
      <div className="download-stats-container">
        <button onClick={downloadStatsHandler}>Download Stats</button>
      </div>
      {proTab === 1 && (
        <div className="bar-chart-holder-pro">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              margin={{ top: 50, right: 0, left: 0, bottom: 0 }}
              data={times}
            >
              <XAxis
                dataKey="time"
                type="number"
                domain={[0, 24]}
                tickCount={lineBarTickCount}
                tick={{ fill: "var(--color-text)" }}
                tickLine={{ fill: "var(--color-text)" }}
                padding={{ left: 25 }}
                interval={"preserveEnd"}
              />
              <YAxis
                type="number"
                allowDecimals={false}
                domain={[0, "dataMax + 1"]}
                tick={{ fill: "var(--color-text)" }}
                tickLine={{ fill: "var(--color-text)" }}
                tickCount={props.data.total + 2}
                padding={{ bottom: 15 }}
                mirror={true}
              />
              <Tooltip
                cursor={{ fill: "var(--color-background)" }}
                wrapperStyle={{ backgroundColor: "transparent" }}
                itemStyle={{ color: "var(--color-background)", padding: 0 }}
                content={<CustomTooltip />}
              />
              <Legend
                formatter={(value, entry, index) => (
                  <span style={{ color: "var(--color-text)" }}>
                    Clicks by Time of Day
                  </span>
                )}
                wrapperStyle={{ top: 20, left: 0 }}
              />
              <Line
                type="basis"
                dataKey="value"
                stroke="var(--color-lightSpecial)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {proTab === 0 && (
        <div id="geoMapHolder">
          <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
          </MapContainer>
          {/*<div className="sorting-countries-container">
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
          </ul>*/}
        </div>
      )}
      {proTab === 2 &&
        advancedTab === 0 &&
        (groupedBrowserData.length > 0 ? (
          <div className="bar-chart-holder-pro">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                margin={{ top: 50, right: 0, left: 0, bottom: 0 }}
                data={groupedBrowserData}
              >
                <XAxis
                  tickLine={{ fill: "var(--color-text)" }}
                  padding={{ left: 25 }}
                  dataKey="name"
                  interval={0}
                  tick={<CustomizedAxisTick />}
                />
                <YAxis
                  type="number"
                  allowDecimals={false}
                  domain={[0, "dataMax + 1"]}
                  tick={{ fill: "var(--color-text)" }}
                  tickLine={{ fill: "var(--color-text)" }}
                  tickCount={props.data.total + 2}
                  padding={{ bottom: 15 }}
                  mirror={true}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-background)" }}
                  wrapperStyle={{ backgroundColor: "transparent" }}
                  contentStyle={{
                    padding: "1rem",
                    backgroundColor: "var(--color-text)",
                    color: "var(--color-background)",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "var(--color-background)", padding: 0 }}
                />
                <Legend
                  formatter={(value, entry, index) => (
                    <span style={{ color: "var(--color-text)" }}>
                      Clicks by Browser Type
                    </span>
                  )}
                  wrapperStyle={{ top: 20, left: 0 }}
                />
                <Bar dataKey="value" fill="transparent">
                  {groupedBrowserData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={browserBarColors[index % 2]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="countries-info">
            <div className="sorting-countries-container">
              <div className="displaying-x-countries">
                <h3>No browser data to display.</h3>
              </div>
            </div>
          </div>
        ))}
      {proTab === 2 &&
        advancedTab === 1 &&
        (groupedOsData.length > 0 ? (
          <div className="bar-chart-holder-pro">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                margin={{ top: 50, right: 0, left: 0, bottom: 0 }}
                data={groupedOsData}
              >
                <XAxis
                  tickLine={{ fill: "var(--color-text)" }}
                  padding={{ left: 25 }}
                  dataKey="name"
                  interval={0}
                  tick={<CustomizedAxisTick />}
                />
                <YAxis
                  type="number"
                  allowDecimals={false}
                  domain={[0, "dataMax + 1"]}
                  tick={{ fill: "var(--color-text)" }}
                  tickLine={{ fill: "var(--color-text)" }}
                  tickCount={props.data.total + 2}
                  padding={{ bottom: 15 }}
                  mirror={true}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-background)" }}
                  wrapperStyle={{ backgroundColor: "transparent" }}
                  contentStyle={{
                    padding: "1rem",
                    backgroundColor: "var(--color-text)",
                    color: "var(--color-background)",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "var(--color-background)", padding: 0 }}
                />
                <Legend
                  formatter={(value, entry, index) => (
                    <span style={{ color: "var(--color-text)" }}>
                      Clicks by Operating System
                    </span>
                  )}
                  wrapperStyle={{ top: 20, left: 0 }}
                />
                <Bar dataKey="value" fill="transparent">
                  {groupedOsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={osBarColors[index % 2]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="countries-info">
            <div className="sorting-countries-container">
              <div className="displaying-x-countries">
                <h3>No OS data to display.</h3>
              </div>
            </div>
          </div>
        ))}
      {proTab === 2 &&
        advancedTab === 2 &&
        (groupedDeviceData.length > 0 ? (
          <div className="bar-chart-holder-pro">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                margin={{ top: 50, right: 0, left: 0, bottom: 0 }}
                data={groupedDeviceData}
              >
                <XAxis
                  tickLine={{ fill: "var(--color-text)" }}
                  padding={{ left: 25 }}
                  dataKey="name"
                  interval={0}
                  tick={<CustomizedAxisTick />}
                />
                <YAxis
                  type="number"
                  allowDecimals={false}
                  domain={[0, "dataMax + 1"]}
                  tick={{ fill: "var(--color-text)" }}
                  tickLine={{ fill: "var(--color-text)" }}
                  tickCount={props.data.total + 2}
                  padding={{ bottom: 15 }}
                  mirror={true}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-background)" }}
                  wrapperStyle={{ backgroundColor: "transparent" }}
                  contentStyle={{
                    padding: "1rem",
                    backgroundColor: "var(--color-text)",
                    color: "var(--color-background)",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "var(--color-background)", padding: 0 }}
                />
                <Legend
                  formatter={(value, entry, index) => (
                    <span style={{ color: "var(--color-text)" }}>
                      Clicks by Device Type
                    </span>
                  )}
                  wrapperStyle={{ top: 20, left: 0 }}
                />
                <Bar dataKey="value" fill="transparent">
                  {groupedDeviceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={browserBarColors[index % 2]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="countries-info">
            <div className="sorting-countries-container">
              <div className="displaying-x-countries">
                <h3>No device data to display.</h3>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default ProDashboard;

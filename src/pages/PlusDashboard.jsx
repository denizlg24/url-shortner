import React, { PureComponent } from "react";
import { useState, useEffect } from "react";
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

const PlusDashboard = (props) => {
  //const [filterUp, toggleFilter] = useState(true);
  const [plusTab, selectPlusTab] = useState(1);
  const [advancedTab, selectAdvancedTab] = useState(0);
  const [lineBarTickCount, toggleSize] = useState(24);

  useEffect(() => {
    function handleResize() {
      toggleSize(window.innerWidth < 600 ? 12 : 24);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const times = Object.entries(props.data.byTimeOfDay);
  const timesData = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString();

    const existingItem = times.find((item) => item[0] === hour);

    if (!existingItem) {
      timesData.push({
        name: ("0" + hour).slice(-2),
        value: 0,
      });
    } else {
      timesData.push({
        name: existingItem[0],
        value: +existingItem[1],
      });
    }
  }

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

  const browserBarColors = [
    "var(--color-lightSpecial)",
    "var(--color-darkSpecial)",
  ];

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
  return (
    <>
      <div className="page-select-pro-dashboard">
        <h2>Select Stats</h2>
        <div className="page-select-pro-content">
          <span className="page-select-pro-item">
            <button
              id={plusTab === 0 ? "selected" : ""}
              onClick={() => {
                selectPlusTab(0);
              }}
            >
              Geo Data
            </button>
          </span>
          <span className="page-select-pro-item">
            <button
              id={plusTab === 1 ? "selected" : ""}
              onClick={() => {
                selectPlusTab(1);
              }}
            >
              Time Data
            </button>
          </span>
          <span className="page-select-pro-item">
            <button
              id={plusTab === 2 ? "selected" : ""}
              onClick={() => {
                selectPlusTab(2);
              }}
            >
              Advanced Data
            </button>
          </span>
        </div>
        {plusTab === 2 && (
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
      {plusTab === 1 && (
        <div className="bar-chart-holder-pro">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              margin={{ top: 50, right: 0, left: 0, bottom: 0 }}
              data={timesData}
            >
              <XAxis
                dataKey="name"
                type="number"
                domain={[0, 23]}
                tickCount={lineBarTickCount}
                tick={{ fill: "var(--color-text)" }}
                tickLine={{ fill: "var(--color-text)" }}
                padding={{ left: 25 }}
                interval={0}
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
                formatter={(value, name, props) => [`Clicks: ${value}`]}
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
                type="monotoneX"
                dataKey="value"
                stroke="var(--color-lightSpecial)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {plusTab === 0 && (
        <div className="countries-info">
          <div className="sorting-countries-container">
            <div className="displaying-x-countries">
              <h3>Upgrade to the Pro Plan for this feature!</h3>
            </div>
          </div>
        </div>
      )}
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
      {plusTab === 2 &&
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
      {plusTab === 2 && advancedTab === 1 && (
        <div className="countries-info">
          <div className="sorting-countries-container">
            <div className="displaying-x-countries">
              <h3>Upgrade to the Pro Plan for this feature!</h3>
            </div>
          </div>
        </div>
      )}
      {plusTab === 2 && advancedTab === 2 && (
        <div className="countries-info">
          <div className="sorting-countries-container">
            <div className="displaying-x-countries">
              <h3>Upgrade to the Pro Plan for this feature!</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlusDashboard;

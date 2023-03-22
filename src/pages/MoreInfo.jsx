import Services from "../services/Services";
import "./MoreInfo.css";
import {
  BsCheckLg,
  BsXLg,
  BsChevronDown,
  BsChevronRight,
} from "react-icons/bs";
import { useState, useEffect } from "react";
import { feature } from "topojson-client";

const MoreInfo = (props) => {
  const [isMobile, toggleSize] = useState(false);

  useEffect(() => {
    function handleResize() {
      toggleSize(window.innerWidth < 1440);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const featuresData = {
    "Free Plan": {
      price: "0€/month",
      planId: "free",
      planIndx: 0,
      planName: "Free",
    },
    "Basic Plan": {
      price: "5€/month",
      planId: "basic",
      lookUpKey: import.meta.env.VITE_BASIC_PLAN_KEY,
      planIndx: 1,
      planName: "Basic",
    },
    "Plus Plan": {
      price: "15€/month",
      planId: "plus",
      lookUpKey: import.meta.env.VITE_PLUS_PLAN_KEY,
      upgrade: import.meta.env.VITE_BASIC_PLUS_KEY,
      planIndx: 2,
      planName: "Plus",
    },
    "Pro Plan": {
      price: "25€/month",
      planId: "pro",
      lookUpKey: import.meta.env.VITE_PRO_PLAN_KEY,
      upgrade:
        props.myPlan === "basic"
          ? import.meta.env.VITE_BASIC_PRO_KEY
          : import.meta.env.VITE_BASIC_PLUS_PRO,
      planIndx: 3,
      planName: "Pro",
    },
  };

  const actualFeatures = {
    "Short Links": [
      { type: "text", val: "3/mo" },
      { type: "text", val: "25/mo" },
      { type: "text", val: "50/mo" },
      { type: "text", val: "Unlimited" },
    ],
    "Get when a link was last clicked": [
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get total clicks for a link": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get clicks by time of day for a link": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get clicks by browser type for a link": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get clicks by operating system for a link": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get clicks by device type for a link": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get clicks by city for a link": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
    ],
    "Use your own custom code": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
    ],
  };

  const [activeDesc, activateDesc] = useState([]);

  const clickDescHandler = (e, index) => {
    e.preventDefault();
    activateDesc((prevState) => {
      const newArr = [
        ...(prevState.indexOf(index) === -1
          ? [...prevState, index]
          : [...[...prevState].filter((x) => x != index)]),
      ];
      return newArr;
    });
  };

  const plansNames = ["Free Plan", "Basic Plan", "Plus Plan", "Pro Plan"];
  const planIds = ["free", "basic", "plus", "pro"];

  const getPlanHandler = (e, lookUpKey, feature) => {
    e.preventDefault();
    if (
      feature.planIndx > planIds.indexOf(props.myPlan) &&
      props.isLoggedIn &&
      props.myPlan != "free"
    ) {
      //mean the button is upgrade to
      Services.upgradePlan(feature.upgrade, props.sub);
    } else if (
      feature.planIndx > planIds.indexOf(props.myPlan) &&
      props.isLoggedIn &&
      props.myPlan === "free"
    ) {
      Services.subscribeToPlan(lookUpKey, props.sub);
    } else if (
      feature.planIndx <= planIds.indexOf(props.myPlan) &&
      props.isLoggedIn
    ) {
      props.subscribed_clickHandler(e);
    } else if (!props.isLoggedIn) {
      props.clickFreeHandler(e);
    }
  };

  return (
    <div className="more-info-outer-container">
      <div className="more-info-inner-container">
        <div className="more-info-title" id="mobile-more-info-identifier">
          <h2>Detailed Feature Comparison</h2>
        </div>
        {!isMobile ? (
          <div className="more-info-table-holder">
            <table id="more-info-table">
              <thead id="more-info-table-head">
                <tr id="more-info-table-title">
                  <th
                    style={{
                      width: "25%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h3 style={{ width: "max-content" }}>Features</h3>
                  </th>
                  {Object.keys(featuresData).map((feature) => {
                    return (
                      <th key={feature}>
                        <h3 style={{ width: "max-content" }}>{feature}</h3>
                        <h4>{featuresData[feature].price}</h4>
                        <button
                          type="button"
                          onClick={(e) => {
                            getPlanHandler(
                              e,
                              featuresData[feature].lookUpKey,
                              featuresData[feature]
                            );
                          }}
                        >
                          {props.isLoggedIn
                            ? featuresData[feature].planId === props.myPlan
                              ? "Manage Plan."
                              : featuresData[feature].planIndx >
                                planIds.indexOf(props.myPlan)
                              ? "Upgrade to " +
                                featuresData[feature].planName +
                                "."
                              : "Downgrade to " +
                                featuresData[feature].planName +
                                "."
                            : featuresData[feature].planId === "free"
                            ? "Join for Free."
                            : "Upgrade to " +
                              featuresData[feature].planName +
                              "."}
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody id="more-info-table-body">
                {Object.keys(actualFeatures).map((feature) => {
                  return (
                    <tr key={feature} id="more-info-table-title">
                      <td id="more-info-table-desc" style={{ width: "25%" }}>
                        {feature}
                      </td>
                      {actualFeatures[feature].map((desc) => {
                        if (desc.type === "text") {
                          return (
                            <td
                              key={
                                feature +
                                actualFeatures[feature].indexOf(desc).toString()
                              }
                              id="more-info-table-desc"
                            >
                              {desc.val}
                            </td>
                          );
                        }
                        if (desc.type === "img") {
                          return (
                            <td
                              key={
                                feature +
                                actualFeatures[feature].indexOf(desc).toString()
                              }
                              id="more-info-table-desc"
                            >
                              <desc.val
                                style={{
                                  color: desc.val === BsXLg ? "red" : "green",
                                }}
                              />
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mobile-more-info-container">
            <ul>
              {Object.keys(actualFeatures).map((feature) => {
                return (
                  <li key={feature}>
                    <div
                      className={
                        "feature-title-more-info " +
                        (activeDesc.filter(
                          (x) =>
                            x == Object.keys(actualFeatures).indexOf(feature)
                        ).length %
                          2 ===
                        0
                          ? " feature-title-more-info-not-expanded-more-info"
                          : "")
                      }
                      onClick={(e) => {
                        clickDescHandler(
                          e,
                          Object.keys(actualFeatures).indexOf(feature)
                        );
                      }}
                    >
                      <p>{feature}</p>
                      {activeDesc.filter(
                        (x) => x == Object.keys(actualFeatures).indexOf(feature)
                      ).length %
                        2 ===
                      0 ? (
                        <BsChevronDown />
                      ) : (
                        <BsChevronRight />
                      )}
                    </div>
                    {actualFeatures[feature].map((desc) => {
                      if (desc.type === "text") {
                        return (
                          <div
                            key={
                              feature +
                              actualFeatures[feature].indexOf(desc).toString()
                            }
                            className={
                              "mobile-more-info-desc-holder " +
                              (activeDesc.filter(
                                (x) =>
                                  x ==
                                  Object.keys(actualFeatures).indexOf(feature)
                              ).length %
                                2 ===
                              0
                                ? "not-expanded-more-info"
                                : "")
                            }
                            style={{
                              borderTopWidth:
                                actualFeatures[feature].indexOf(desc) === 0
                                  ? "1px"
                                  : "",
                            }}
                          >
                            <div>
                              {
                                plansNames[
                                  actualFeatures[feature].indexOf(desc)
                                ]
                              }
                            </div>
                            <div>{desc.val}</div>
                          </div>
                        );
                      }
                      if (desc.type === "img") {
                        return (
                          <div
                            key={
                              feature +
                              actualFeatures[feature].indexOf(desc).toString()
                            }
                            className={
                              "mobile-more-info-desc-holder " +
                              (activeDesc.filter(
                                (x) =>
                                  x ==
                                  Object.keys(actualFeatures).indexOf(feature)
                              ).length %
                                2 ===
                              0
                                ? "not-expanded-more-info"
                                : "")
                            }
                            style={{
                              borderTopWidth:
                                actualFeatures[feature].indexOf(desc) === 0
                                  ? "1px"
                                  : "",
                            }}
                          >
                            <div>
                              {
                                plansNames[
                                  actualFeatures[feature].indexOf(desc)
                                ]
                              }
                            </div>
                            <div>
                              {" "}
                              <desc.val
                                style={{
                                  color: desc.val === BsXLg ? "red" : "green",
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    })}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreInfo;

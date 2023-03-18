import Services from "../services/Services";
import "./MoreInfo.css";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import { useState, useEffect } from "react";

const MoreInfo = (props) => {
  const [smallerScreen, toggleSize] = useState(false);

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
      planIndx: 2,
      planName: "Plus",
    },
    "Pro Plan": {
      price: "25€/month",
      planId: "pro",
      lookUpKey: import.meta.env.VITE_PRO_PLAN_KEY,
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
    "Get a link's total click": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get a link's clicks by time of day": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get a link's clicks by browser type": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get a link's clicks by operating system": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get a link's clicks by device type": [
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsXLg },
      { type: "img", val: BsCheckLg },
    ],
    "Get a link's clicks by city": [
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

  const getPlanHandler = (lookUpKey) => {
    e.preventDefault();
    Services.subscribeToPlan(lookUpKey);
  };

  return (
    <div className="more-info-outer-container">
      <div className="more-info-inner-container">
        <div className="more-info-title">
          <h2>Detailed Feature Comparison</h2>
        </div>
        {!smallerScreen ? (
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
                          onClick={
                            props.isLoggedIn
                              ? props.myPlan != "free"
                                ? props.subscribed_clickHandler
                                : () => {
                                    getPlanHandler(
                                      featuresData[feature].lookUpKey
                                    );
                                  }
                              : props.clickFreeHandler
                          }
                        >
                          {props.isLoggedIn
                            ? featuresData[feature].planId === props.myPlan
                              ? "Manage Plan."
                              : featuresData[feature].planId > props.myPlan
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
                    <tr id="more-info-table-title">
                      <td id="more-info-table-desc" style={{ width: "25%" }}>
                        {feature}
                      </td>
                      {actualFeatures[feature].map((desc) => {
                        if (desc.type === "text") {
                          return <td id="more-info-table-desc">{desc.val}</td>;
                        }
                        if (desc.type === "img") {
                          return (
                            <td id="more-info-table-desc">
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
          <h1>Advanced plan details for smaller screens will be available soon! Sorry for the inconvinience.</h1>
        )}
      </div>
    </div>
  );
};

export default MoreInfo;

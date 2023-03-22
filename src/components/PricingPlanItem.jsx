import "./PricingPlanItem.css";
import Services from "../services/Services";

const PricingPlanItem = (props) => {
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!props.isLoggedIn) {
      props.clickFreeHandler(e);
      return;
    }
    if (
      props.buttonText.split(" ")[0] === "Manage" ||
      props.buttonText.split(" ")[0] === "Current" ||
      props.buttonText.split(" ")[0] === "Downgrade"
    ) {
      props.subscribed_clickHandler(e);
      return;
    }
    
    if (
      props.buttonText.split(" ")[0] === "Upgrade" &&
      props.myPlan != "free"
    ) {
      Services.upgradePlan(props.upgradeLookupKey, props.sub);
    } else {
      Services.subscribeToPlan(props.lookUpKey, props.sub);
    }
  };

  return (
    <div className="pricing-item-container">
      <div className="pricing-item-title">
        <h1>{props.title}</h1>
        <p>{props.subltile}</p>
      </div>
      <div className="pricing-item-price">
        <h2>
          {props.price}€<span>/month</span>
        </h2>
      </div>
      <div className="pricing-item-desc">
        <h3>{props.desc}</h3>
        <ul className="pricing-item-selling-points">
          {props.features.map((feature) => {
            return (
              <li id={feature.id} key={feature.key}>
                {feature.title}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pricing-item-actions">
        <form onSubmit={submitHandler}>
          <button id="checkout-and-portal-button" type="submit">
            {props.buttonText}
          </button>
        </form>
        <p
          onClick={() => {
            const element = document.getElementById("more-info-table");
            const element2 = document.getElementById(
              "mobile-more-info-identifier"
            );
            if (element) {
              element.scrollIntoView();
            }
            if (element2) {
              element2.scrollIntoView();
            }
          }}
        >
          Learn More
        </p>
      </div>
    </div>
  );
};

export default PricingPlanItem;

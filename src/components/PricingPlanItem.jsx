import "./PricingPlanItem.css";
import Services from "../services/Services";

const PricingPlanItem = (props) => {

  const submitHandler = (e) => {
    e.preventDefault();
    Services.subscribeToPlan(props.lookUpKey,props.sub);
  }

  return (
    <div className="pricing-item-container">
      <div className="pricing-item-title">
        <h1>{props.title}</h1>
        <p>{props.subltile}</p>
      </div>
      <div className="pricing-item-price">
        <h2>
          {props.price}$<span>/month</span>
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
        {(props.lookUpKey && !props.isFree) ? (
          <form
            onSubmit={submitHandler}
          >
            <button id="checkout-and-portal-button" type="submit">
              {props.buttonText}
            </button>
          </form>
        ) : (
          <button onClick={props.onClickHandler}>
            <p>{props.buttonText}</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default PricingPlanItem;

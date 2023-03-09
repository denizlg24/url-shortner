import PricingPlanItem from "../components/PricingPlanItem";
import "./Pricing.css";

const Pricing = (props) => {
  return (
    <>
      <div className="pricing-holder" id="pricingsID">
        <div className="pricing-container">
          <hr className="features-divider-top" />
          <div className="features-title">
            <h1>Plans and Pricing</h1>
          </div>
          <div className="pricing-plans-holder">
            <PricingPlanItem
              title={"Free Plan"}
              subltile={"Don't overthink it!"}
              price={0}
              desc={
                "With this plan, you can enjoy limited features, but still experience the benefits of our product."
              }
              buttonText={"Join for Free."}
              features={[
                { title: "Up to 3 shortn's/month.", id: "available" },
                { title: "Get a url's total clicks", id: "medium" },
                { title: "Advanced Stats", id: "not-available" },
                { title: "Custom Short Url", id: "not-available" },
              ]}
              onClickHandler={props.clickFreeHandler}
            ></PricingPlanItem>
            <PricingPlanItem
              title={"Basic Plan"}
              subltile={"Now we are talking!"}
              price={5}
              desc={
                "Perfect for individuals or small businesses who need essential features at an affordable price."
              }
              buttonText={"Get Basic."}
              features={[
                { title: "Up to 25 shortn's/month.", id: "available" },
                { title: "Get a url's total clicks", id: "available" },
                { title: "Advanced Stats", id: "not-available" },
                { title: "Custom Short Url", id: "not-available" },
              ]}
              onClickHandler={props.clickFreeHandler}
            ></PricingPlanItem>
            <PricingPlanItem
              title={"Plus Plan"}
              subltile={"Get ready for the Plus factor!"}
              price={15}
              desc={
                "Our Plus plan is perfect for those who want more advanced features and link analytics."
              }
              buttonText={"Get Plus."}
              features={[
                { title: "Up to 50 shortn's/month.", id: "available" },
                { title: "Get a url's total clicks", id: "available" },
                { title: "Advanced Stats", id: "medium" },
                { title: "Custom Short Url", id: "not-available" },
              ]}
              onClickHandler={props.clickFreeHandler}
            ></PricingPlanItem>
            <PricingPlanItem
              title={"Pro Plan"}
              subltile={"Welcome to the Pro league!"}
              price={25}
              desc={
                "Our Pro plan is designed for power users and those who need the most advanced features and capabilities."
              }
              buttonText={"Get Pro."}
              features={[
                { title: "Unlimited shortn's.", id: "available" },
                { title: "Get a url's total clicks", id: "available" },
                { title: "Advanced Stats", id: "available" },
                { title: "Custom Short Url", id: "available" },
              ]}
              onClickHandler={props.clickFreeHandler}
            ></PricingPlanItem>
          </div>
          <div className="color-legend-pricing">
            <div className="color-legend-item" id="available">
              <h4>
                <strike>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </strike>
                &nbsp;&nbsp;Available
              </h4>
            </div>
            <div className="color-legend-item" id="medium">
              <h4>
                <strike>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </strike>
                &nbsp;&nbsp;Limited Use
              </h4>
            </div>
            <div className="color-legend-item" id="not-available">
              <h4>
                <strike>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </strike>
                &nbsp;&nbsp;Not Available
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;

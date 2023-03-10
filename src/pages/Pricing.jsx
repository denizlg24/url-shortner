import { useEffect, useState } from "react";
import PricingPlanItem from "../components/PricingPlanItem";
import Services from "../services/Services";
import "./Pricing.css";

const Pricing = (props) => {

  const[myPlan,setPlan] = useState();
  useEffect(() => {
    const getSubscription = async () => { 
      const response = await Services.getPlan(localStorage.getItem("accessToken"));
      if(response.response === "ok"){
        setPlan(response.data);
      }
      else{
        console.log(response);
      }
    }
    if(localStorage.getItem("accessToken")){
      getSubscription();
    }
  },[])


  return (
    <>
      <div className="pricing-holder" id="pricingsID">
        <div className="pricing-container">
          <hr className="features-divider-top" />
          <div className="features-title">
            <h1>Plans and Pricing</h1>
          </div>
          <hr className="features-divider-bottom" />
          <div className="pricing-plans-holder">
            <PricingPlanItem
              title={"Free Plan"}
              subltile={"Don't overthink it!"}
              price={0}
              desc={
                "With this plan, you can enjoy limited features, but still experience the benefits of our product."
              }
              buttonText={!myPlan ? ("Join for Free.") : (!props.isLoggedIn? "Join for Free." : (myPlan.subscription === "free" ? "Current Plan." : "Downgrade."))}
              features={[
                { title: "Up to 3 shortn's/month.", id: "available" ,key:0 },
                { title: "Get a url's total clicks", id: "medium" ,key:1},
                { title: "Advanced Stats", id: "not-available" ,key:2},
                { title: "Custom Short Url", id: "not-available" ,key:3},
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
              buttonText={!myPlan ? ("Get Basic.") : (!props.isLoggedIn? "Get Basic." : (myPlan.subscription === "basic" ? "Manage Plan" : (myPlan.subscription === "free" ? "Upgrade to Basic." : "Downgrade to Basic.")))}
              features={[
                { title: "Up to 25 shortn's/month.", id: "available" ,key:4},
                { title: "Get a url's total clicks", id: "available" ,key:5},
                { title: "Advanced Stats", id: "not-available" ,key:6},
                { title: "Custom Short Url", id: "not-available" ,key:7},
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
              buttonText={!myPlan ? ("Get Plus.") : (!props.isLoggedIn? "Get Plus." : (myPlan.subscription === "plus" ? "Manage Plan" : ((myPlan.subscription === "free" || myPlan.subscription === "basic") ? "Upgrade to Plus." : "Downgrade to Plus.")))}
              features={[
                { title: "Up to 50 shortn's/month.", id: "available",key:8 },
                { title: "Get a url's total clicks", id: "available" ,key:9},
                { title: "Advanced Stats", id: "medium" ,key:10},
                { title: "Custom Short Url", id: "not-available",key:11 },
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
              buttonText={!myPlan ? ("Get Pro.") : (!props.isLoggedIn? "Get Pro." : (myPlan.subscription === "pro" ? "Manage Plan" : "Upgrade to Plus."))}
              features={[
                { title: "Unlimited shortn's.", id: "available",key:12 },
                { title: "Get a url's total clicks", id: "available",key:13  },
                { title: "Advanced Stats", id: "available",key:14  },
                { title: "Custom Short Url", id: "available",key:15  },
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

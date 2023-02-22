import illustration from "../assets/undraw_lost_online_re_upmy.svg";
import darkIllustration from "../assets/undraw_lost_online_re_upmy dark.svg";

import "./LandingPage.css";

const LandingPage = (props) => {
  return (
    <div className="landingpage-main">
      <div className="landingpage-container">
        <div className="landingpage-info-container">
            <h1 className="landingpage-info-hero">Welcome to <span className="special-text-landing">Shortn</span></h1>
            <h3 className="landingpage-info-catch">We are more than just shorter links.</h3>
            <h4 className="landingpage-info-extra">Increase your brands recognition and get detailed insights on how your links are performing.</h4>
            <div className="landing-actions">
                <button className="landing-button"><h1>Learn More</h1></button>
            </div>
        </div>
        <div className="landingpage-illustration-container">
          <img
            className="landingpage-illustration"
            src={props.dark ? darkIllustration : illustration}
          ></img>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

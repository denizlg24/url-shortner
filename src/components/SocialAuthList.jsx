import "./SocialAuthList.css";
import SocialAuth from "./SocialAuth";
import facebookIcon from "../assets/icons8-facebook-48.png";
import googleIcon from "../assets/icons8-google-48.png";
import githubIcon from "../assets/icons8-github-48.png";

const SocialAuthList = (props) => {
  return (
    <div className="main-container-auth-list">
      <div className="content-auth-list">
        <h1 style={{ textAlign: "center" }}>{!props.regist? "Login with yours socials." : "Sign-up with yours socials." }</h1>
        <SocialAuth
          icon={facebookIcon}
          title={!props.regist? "Login with facebook." : "Sign-up with facebook." }
          altDesc={"Facebook Icon"}
          backgroundColor={"#025497"}
        ></SocialAuth>
        <SocialAuth
          icon={googleIcon}
          title={!props.regist? "Login with google." : "Sign-up with google." }
          altDesc={"Google Icon"}
          backgroundColor={"#be8721"}
        ></SocialAuth>
        <SocialAuth
          icon={githubIcon}
          title={!props.regist? "Login with github." : "Sign-up with github." }
          altDesc={"Github Icon"}
          backgroundColor={"#455a64"}
        ></SocialAuth>
      </div>
    </div>
  );
};

export default SocialAuthList;

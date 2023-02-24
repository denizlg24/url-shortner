import loginPic from "../assets/auth-login-illust.png";
import registPic from "../assets/auth-regist-illust.png";
import facebookIcon from "../assets/icons8-facebook-24.png";
import githubIcon from "../assets/icons8-github-24.png";
import googleIcon from "../assets/icons8-google-24.png";
import Card from "../components/Card";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import "./AuthenticationPage.css";

const AuthenticationPage = (props) => {
  return (
    <div className="auth-main-container">
      <Card>
        <div className="auth-main-form">
          {props.register ? (
            <RegisterForm
              registrationSuccess={props.registrationSuccess}
            ></RegisterForm>
          ) : (
            <LoginForm
              loginSuccessHandler={props.loginSuccessHandler}
            ></LoginForm>
          )}
          <div className="or-section">
            <div className="or-bar"></div>
            <div className="or-text">OR</div>
            <div className="or-bar"></div>
          </div>
          <div className="social-auth-section">
            <div className="social-auth-content">
              <button
                className="social-auth-button"
                onClick={props.handleFacebookLogin}
              >
                <img
                  src={facebookIcon}
                  alt="Clickable Facebook Icon"
                  style={{
                    filter: props.dark
                      ? "invert(99%) sepia(99%) saturate(2%) hue-rotate(337deg) brightness(110%) contrast(101%)"
                      : "",
                  }}
                ></img>
              </button>
              <button
                className="social-auth-button"
                onClick={props.handleGoogleLogin}
              >
                <img
                  src={googleIcon}
                  alt="Clickable Google Icon"
                  style={{
                    filter: props.dark
                      ? "invert(99%) sepia(99%) saturate(2%) hue-rotate(337deg) brightness(110%) contrast(101%)"
                      : "",
                  }}
                ></img>
              </button>
              <button
                className="social-auth-button"
                onClick={props.handleGithubLogin}
              >
                <img
                  src={githubIcon}
                  alt="Clickable Github Icon"
                  style={{
                    filter: props.dark
                      ? "invert(99%) sepia(99%) saturate(2%) hue-rotate(337deg) brightness(110%) contrast(101%)"
                      : "",
                  }}
                ></img>
              </button>
            </div>
          </div>
          <div
            className="auth-illustration-mobile"
            style={{
              background: props.dark
                ? "linear-gradient(to top,var(--color-darkSpecial),var(--color-lightSpecial))"
                : "linear-gradient(to top,var(--color-lightSpecial),var(--color-darkSpecial))",
                display: props.register? "none" : ""
            }}
          >
            {props.register ? (
              <></>
            ) : (
              <div className="auth-illustration-text">
                <div className="auth-illustration-text-mobile">
                  <h1>Access your Shortn account</h1>
                  <p>
                    Sign in to Shortn to access your custom link management
                    dashboard and see detailed statistics on how your links are
                    performing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="auth-illustration"
          style={{
            background: props.dark
              ? "linear-gradient(to top,var(--color-darkSpecial),var(--color-lightSpecial))"
              : "linear-gradient(to top,var(--color-lightSpecial),var(--color-darkSpecial))",
          }}
        >
          {props.register ? (
            <div className="auth-illustration-text">
              <div>
                <h1>Supercharge Your Links with Shortn</h1>
                <p>
                  Shortn offers powerful features for businesses looking to
                  level up their link game. Sign up now to get detailed
                  insights, manage your branded links, and take your marketing
                  to the next level.
                </p>
                <div className="auth-illustration-pic-holder">
                  <img
                    className="auth-illustration-pic"
                    src={registPic}
                    alt="Illustration of Woman creating a profile."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-illustration-text">
              <div>
                <h1>Access your Shortn account</h1>
                <p>
                  Sign in to Shortn to access your custom link management
                  dashboard and see detailed statistics on how your links are
                  performing.
                </p>
                <div className="auth-illustration-pic-holder">
                  <img
                    className="auth-illustration-pic"
                    src={loginPic}
                    alt="Illustration of Woman sitting at her desk on a computer."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthenticationPage;

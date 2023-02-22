import "./SocialAuth.css";

const SocialAuth = (props) => {
  const onClickHandler = (e) => {
    props.clickEventHandler(e);
  };

  return (
    <button className="main-button-social-auth" onClick={onClickHandler} style={{backgroundColor:props.backgroundColor}}>
      <div className="social-auth-icon-holder">
        <img className="social-auth-icon" src={props.icon} alt={props.altDesc}></img>
      </div>
      <div className="social-auth-text">
        <h1>{props.title}</h1>
      </div>
    </button>
  );
};

export default SocialAuth

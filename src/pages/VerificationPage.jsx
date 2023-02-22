import Card from "../components/Card";
import "./VerificationPage.css";

const VerificationPage = (props) => {
  const onClickHandler = (e) => {
    props.onClickHandler(e);
  };

  return (
    <div className="verification-page-container">
      <Card>
        <div className="verification-content">
          <h1>Almost Done!</h1>
          <h2>
            Head to your email at <span>{props.emailToVerify}</span> and verify
            your account. Allow up to 10 minutes for the confirmation email to
            be sent. Check your <span>Junk/Spam</span> folder just to be safe.
          </h2>
          <div className="qandaa-verification">
            <div className="verification-item">
              <h4>
                <span>Q:</span> Why do we do this?
              </h4>
              <p>
                <span>A:</span> We do this to ensure no bots flood our website.
              </p>
            </div>
            <div className="verification-item">
              <h4>
                <span>Q:</span> Do you sell our data?
              </h4>
              <p>
                <span>A:</span> Absolutely not, your email adress is not
                directly manipulated by us, it's all automatic.
              </p>
            </div>
          </div>
          <div className="verification-actions">
            <h3>Are you finnished, already?</h3>
            <button onClick={onClickHandler}>Go to login</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VerificationPage;

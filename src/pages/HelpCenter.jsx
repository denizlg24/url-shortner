import ContactForm from "../components/ContactForm";
import "./HelpCenter.css";

const HelpCenter = (props) => {
  return (
    <div className="help-center-container">
      <hr className="features-divider-top" />
      <div className="features-title" id="help-center-id">
        <h1>Help Center</h1>
      </div>
      <hr className="features-divider-bottom" />
      <ContactForm sub={props.sub}/>
      <div className="help-center-content">
        <h2>Data Policy:</h2>
        <p>
          At{" "}
          <a href="https://shortn.at" target="_blank" rel="noopener noreferrer">
            Shortn
          </a>
          , we take the privacy and security of our users' personal information
          very seriously. This Data Protection Policy explains how we collect,
          use, and protect your data.{" "}
        </p>
        <p>
          Data Collection: When you use our URL shortener service, we collect
          information such as your email address. When a user clicks on your
          short link, we collect their IP adress, browser type, operating
          system, and device information. We also collect data on your use of
          the service, such as the URLs you shorten and the dates and times of
          your visits.
        </p>{" "}
        <p>
          Data Use: We use this data to operate and improve our service, to
          customize your experience, and to provide analytics to our customers.
          We may also use this data to comply with legal obligations or to
          protect our legal rights.{" "}
        </p>{" "}
        <p>
          Data Protection: We take appropriate technical and organizational
          measures to protect your data against unauthorized or unlawful
          processing, accidental loss, destruction, or damage. We limit access
          to your data to those who have a legitimate need to know it.
        </p>{" "}
        <p>
          Data Sharing: We do not sell or rent your personal information to
          third parties. However, we may share your information with our trusted
          service providers or business partners who assist us in providing our
          service. We may also disclose your information if required by law.
        </p>{" "}
        <h2>Subscription Cancellation:</h2>
        <p>
          At{" "}
          <a href="https://shortn.at" target="_blank" rel="noopener noreferrer">
            Shortn
          </a>
          , we want you to be completely satisfied with our service. If you
          decide to cancel your subscription, you can do so at any time by
          following these steps:
          <ul>
            <li>Log in to your account on our website.</li>
            <li>Go to the home page section and click on pricing.</li>
            <li>Under your current plan click the "Manage Plan" button.</li>
            <li>This will take you to a stripe management page.</li>
            <li>Click on "Cancel Subscription".</li>
            <li>Follow the prompts to complete the cancellation process.</li>
          </ul>
        </p>
        <p>
          If you cancel your subscription before the end of the billing cycle,
          you will not be charged for the following billing period. However, we
          do not offer refunds for any unused portion of your subscription.
          Please note that we partner with Stripe to provide our subscription
          service. Your subscription is subject to Stripe's cancellation policy.
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;

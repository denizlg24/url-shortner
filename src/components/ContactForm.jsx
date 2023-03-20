import "./ContactForm.css";
import illust from '../assets/undraw_writer_q06d.svg'


const ContactForm = (props) => {
  return (
    <div className="contact-form-container">
      <hr className="features-divider-top" />
      <div className="features-title" id="help-center-id">
        <h1>Contact Us</h1>
      </div>
      <hr className="features-divider-bottom" />
      <div className="contact-form-content">
        <form className="contact-form-form">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your name"
            autoComplete="off"
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your email"
            autoComplete="off"
          />
          <textarea name="message" cols="40" rows="10" placeholder="What seems to be the problem?"></textarea>
          <input type="button" value="Get Help" />
        </form>
        <div className="contact-form-text">
          <h4>
            This service is made for any custommer with or without a paid plan
            that has a problem with our product, including billing issues.
            Since this project is in early developmnent, you will have timely support
            for whatever your needs are.
          </h4>
          <img src={illust}  />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

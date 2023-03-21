import "./ContactForm.css";
import illust from "../assets/undraw_writer_q06d.svg";
import Services from "../services/Services";
import { useState } from "react";
import ErrorModal from "./ErrorModal";

const ContactForm = (props) => {
  const [userInput, changeUserInput] = useState({
    name: { value: "", error: "" },
    email: { value: "", error: "" },
    message: { value: "", error: "" },
  });
  const [errorState, displayErrorModal] = useState([]);

  const changeNameHandler = (e) => {
    changeUserInput((prevState) => {
      return {
        ...prevState,
        name: {
          value: e.target.value,
          error:
            e.target.value.trim().lenght <= 0 ? "Name can not be empty!" : "",
        },
      };
    });
  };

  const changeEmailHandler = (e) => {
    changeUserInput((prevState) => {
      return {
        ...prevState,
        email: {
          value: e.target.value,
          error: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)
            ? "Email is not valid!"
            : "",
        },
      };
    });
  };

  const changeMessageHandler = (e) => {
    changeUserInput((prevState) => {
      return {
        ...prevState,
        message: {
          value: e.target.value,
          error:
            e.target.value.trim().lenght <= 0
              ? "Message can not be empty!"
              : "",
        },
      };
    });
  };

  const cancelError = (e) => {
    e.preventDefault();
    displayErrorModal([]);
  };

  const submitHandler = async (e) => {
    if (
      !userInput.name.error &&
      !userInput.email.error &&
      !userInput.message.error &&
      userInput.name.value &&
      userInput.email.value &&
      userInput.message.value
    ) {
      const response = await Services.contactHelp(
        userInput.name.value,
        userInput.email.value,
        userInput.message.value,
        props.sub
      );
      displayErrorModal([
        <ErrorModal
          success={true}
          title={200}
          errorDesc={`Your message has been received under ID: ${response.data.ticketId}\nThanks!`}
          cancelError={cancelError}
        ></ErrorModal>,
      ]);
      changeUserInput({
        name: { value: "", error: "" },
        email: { value: "", error: "" },
        message: { value: "", error: "" },
      });
      return;
    } else {
      if (userInput.name.error) {
        displayErrorModal([
          <ErrorModal
            title={400}
            errorDesc={userInput.name.error}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
      if (userInput.email.error) {
        displayErrorModal([
          <ErrorModal
            title={400}
            errorDesc={userInput.email.error}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
      if (userInput.message.error) {
        displayErrorModal([
          <ErrorModal
            title={400}
            errorDesc={userInput.message.error}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
      if (!userInput.name.value) {
        displayErrorModal([
          <ErrorModal
            title={400}
            errorDesc={"Name can not be empty!"}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
      if (!userInput.email.value) {
        displayErrorModal([
          <ErrorModal
            title={400}
            errorDesc={"Email can not be empty!"}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
      if (!userInput.message.value) {
        displayErrorModal([
          <ErrorModal
            title={400}
            errorDesc={"Message can not be empty!"}
            cancelError={cancelError}
          ></ErrorModal>,
        ]);
        return;
      }
    }
  };

  return (
    <>
      {errorState}
      <div className="contact-form-container">
        <div className="contact-form-content">
          <form className="contact-form-form">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your name"
              autoComplete="off"
              onChange={changeNameHandler}
              value={userInput.name.value}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your email"
              autoComplete="off"
              onChange={changeEmailHandler}
              value={userInput.email.value}
            />
            <textarea
              name="message"
              cols="40"
              rows="10"
              placeholder="What seems to be the problem?"
              onChange={changeMessageHandler}
              value={userInput.message.value}
            ></textarea>
            <input type="button" onClick={submitHandler} value="Get Help" />
          </form>
          <div className="contact-form-text">
            <h4>
              This feature is made for any custommer with or without a paid plan
              that has a problem with our product, including billing issues.
              Since this project is in early developmnent, you will have timely
              support for whatever your needs are.
            </h4>
            <img src={illust} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;

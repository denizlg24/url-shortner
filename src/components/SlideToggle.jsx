import "./SlideToggle.css";

const SlideToggle = (props) => {
  const changeHandler = (event) => {
    props.valueChangeHandler(event);
  };

  return (
    <div className="switch-container">
      <p className="switch-label">{props.labelText}</p>
      <div className="switch">
        <input
          id="checkbox1"
          className="look"
          type="checkbox"
          onChange={changeHandler}
          checked={props.toggled}
        />
        <label htmlFor="checkbox1"></label>
      </div>
    </div>
  );
};

export default SlideToggle;

import "./Navlink.css";

const Navlink = (props) => {
  return (
    <div className="navlink" onClick={props.clickHandler}>
      <p>{props.title}</p>
    </div>
  );
};

export default Navlink;

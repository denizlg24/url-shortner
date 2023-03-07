import "./FeatureCard.css";

const FeatureCard = (props) => {
  return (
    <div className="feature-card-container">
      <div className="image-feature-card" style={{backgroundImage: `url('${props.imgSrc}')`}}>
      </div>
      <div className="info-feature-card">
        <div className="feature-title">
            <h1>{props.title}</h1>
        </div>
        <div className="feature-desc">
            <p>{props.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;

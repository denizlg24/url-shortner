import FeatureCard from "../components/FeatureCard";
import "./Features.css";

const Features = (props) => {
  const featuresArr = [
    {
      id: 0,
      title: "Blazing fast performance!",
      desc: "With our proprietary API, we ensure you get extremely fast short url creation along with blazing fast performance when getting advanced stats.",
    },
    {
      id: 1,
      title: "Advanced Analytics.",
      desc: "Every created link is registered on our database and when a client clicks the url you created, we privately check where they are clicking it from, store it in the urls stats, providing you with detailed geo-analytics for your url.",
    },
    {
      id: 2,
      title: "Amazing Privacy.",
      desc: "Since we also use our own API for the authentication part of our service, we can ensure your data is safe! No one has access to your private data. With salt and pepper encryption we ensure your passwords are safe!",
    },
    {
      id: 3,
      title: "Frequent Updates.",
      desc: "As this project is still in development, you can expect frequent updates, bringing you with exciting new features every time a new update rolls. Along with this comes always online developer support.",
    },
  ];

  return (
    <>
      <div className="features-features-holder" id="featuresID">
      <hr className="features-divider-top"/>
        <div className="features-title">
          <h1>Why are we the right choice?</h1>
        </div>
        <hr className="features-divider-bottom"/>
        <div className="features-features-container">
          {featuresArr.map((feature) => {
            return (
              <FeatureCard
                title={feature.title}
                desc={feature.desc}
                key={feature.id}
              ></FeatureCard>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Features;

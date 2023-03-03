import "./LinkStats.css";

const LinkStats = (props) => {
  const countries = Object.entries(props.data.byCountry);
  return (
    <div className="main-error-modal">
      <div className="main-stats-container">
        <h2>Stats for {props.shortUrl}</h2>
        <div>
          <h3>Total Clicks {props.data.total}</h3>
        </div>
        <div>
          <ul>
            {countries.map((country) => {
              return (
                <li>
                  <img
                    src={`https://flagcdn.com/w160/${country[0].toLowerCase()}.png`}
                    alt=""
                  />
                  : {country[1]}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default LinkStats;

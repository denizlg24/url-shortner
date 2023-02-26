import './LinkItem.css';

const LinkItem = (props) =>{

    const onClickHandler = (e) =>{
        props.onClickHandler(props.shortUrl);
    }
    return (
        <div className="link-container">
            <div className="link-info">
                <h3>Long URL: <a href={props.longUrl} target="_blank">{(props.longUrl.length < 30) ? props.longUrl : "..."}</a></h3>
                <h3>Short URL: <a href={props.shortUrl} target="_blank">{props.shortUrl}</a></h3>
            </div>
            <div className="link-actions">
                <button onClick={onClickHandler}>Get Stats</button>
            </div>
        </div>
    )
}

export default LinkItem;
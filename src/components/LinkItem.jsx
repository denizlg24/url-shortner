import './LinkItem.css';

const LinkItem = (props) =>{

    const onClickHandler = (e) =>{
        props.onClickHandler(props.shortUrl);
    }
    return (
        <div className="link-container" style={{border: "2px dashed " + (props.dark ? "rgba(255,255,255, 0.2)" : "rgba(0,0,0, 0.2)")}}>
            <div className="link-info">
                <h3 id='long-url-linkitem'>Long URL: <a href={props.longUrl} target="_blank">{(props.longUrl.length < 45) ? props.longUrl : props.longUrl.slice(0,45) + "..."}</a></h3>
                <h3 id='long-url-linkitem'>Short URL: <a href={props.shortUrl} target="_blank">{props.shortUrl.slice(8)}</a></h3>
            </div>
            <div className="link-actions">
                <button onClick={onClickHandler}>Get Stats</button>
            </div>
        </div>
    )
}

export default LinkItem;
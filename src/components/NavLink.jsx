import './Navlink.css';

const Navlink = (props) =>{
    return (
        <div className='navlink'>
            <p onClick={props.clickHandler}>{props.title}</p>
        </div>
    )
}

export default Navlink;
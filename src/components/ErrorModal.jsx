import { useEffect } from 'react';
import Services from '../services/Services';
import './ErrorModal.css';

const ErrorModal = (props) =>{
    useEffect(() => {
        Services.disableScroll();
    },[])

    const cancelHandler = (e) => {
        e.preventDefault();
        Services.enableScroll();
        props.cancelError(e);
    }
    return (
        <div className='main-error-modal'>
            <div className='error-modal-container'>
                <div className='error-modal-title-bar' style={{backgroundColor: !props.success? "rgb(241, 88, 88)" : "rgb(0, 75, 34)"}}>
                    <h3>{props.title}</h3>
                    <button className="close-modal"onClick={cancelHandler}><img src="https://img.icons8.com/ios-glyphs/30/null/macos-close.png"/></button>
                </div>
                <div className='error-modal-desc'>
                    <p>{props.errorDesc}</p>
                </div>
            </div>
        </div>
    )
}

export default ErrorModal;
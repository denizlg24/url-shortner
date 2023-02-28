import './ErrorModal.css';

const ErrorModal = (props) =>{
    return (
        <div className='main-error-modal'>
            <div className='error-modal-container'>
                <div className='error-modal-title-bar'>
                    <h3>{props.title}</h3>
                    <button className="close-modal"onClick={props.cancelError}><img src="https://img.icons8.com/ios-glyphs/30/null/macos-close.png"/></button>
                </div>
                <div className='error-modal-desc'>
                    <p>{props.errorDesc}</p>
                </div>
            </div>
        </div>
    )
}

export default ErrorModal;
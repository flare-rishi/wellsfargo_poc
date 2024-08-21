import "./formSubmitAnimation.css";

const FormSubmitAnimation = () => {
    return (
        <div className="loading-main-form">
            <svg className="loading-svg-form" viewBox="0 0 90 38 ">
                <circle className="outer-circle" r="15" cy="50%" cx="50%"></circle>
                {/* <circle className="inner-circle" r="10" cy="50%" cx="50%"></circle> */}
            </svg>
        </div>
    );
};

export default FormSubmitAnimation;

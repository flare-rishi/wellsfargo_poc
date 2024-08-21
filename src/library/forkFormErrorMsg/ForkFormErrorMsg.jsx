import "./forkFormErrorMsg.css";
const ForkFormErrorMsg = ({ msg }) => {
    return (
        <div className="fork-form-error-msg">
            <span className="form-error-msg">!&nbsp;{msg}</span>
        </div>
    );
};

export default ForkFormErrorMsg;

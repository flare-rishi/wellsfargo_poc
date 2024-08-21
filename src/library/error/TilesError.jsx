import "./tileError.css";

const TilesError = ({ msg, redirectmsg, link }) => {
    return (
        <div className="tile-error-container">
            <div className="tile-error-box">
                <span className="tile-error-msg">!&nbsp;{msg}</span>
            </div>
        </div>
    );
};

export default TilesError;

import "./PiiIndicator.css"; // Create a CSS file for the styles

const PiiIndicator = ({ value, hideFalse }) => {
    return (
        <span className={`pii-indicator ${value ? "true" : "false"}`}>
            {value ? (
                <span className="true-icon">&#10003;</span>
            ) : (
                <span className="false-icon">{hideFalse ? "" : "\u00D7"}</span>
            )}
        </span>
    );
};

export default PiiIndicator;

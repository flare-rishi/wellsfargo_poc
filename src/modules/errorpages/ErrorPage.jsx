import { ERROR404 } from "../../assets/assets";
import "./errorpage.css";

const ErrorPage = ({ msg = "Oops table not found", redirectMsg = "To get the  dataset", img, link }) => {
    return (
        <div className="error-container">
            <div className="error-box">
                <div className="error-msg-link">
                    <div className="error-msg-wrapper">
                        <span className="error-msg">! {msg}</span>
                    </div>
                    <div className="error-link">
                        <p>{redirectMsg}</p>
                        &nbsp;
                        <a href={link}>click here</a>
                    </div>
                </div>
                <div className="error-image">
                    <img src={ERROR404} alt="404 icon" />
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;

import React, { useState } from "react";
import "./Home.css";
import { Link, useLocation } from "react-router-dom";

import { Button, TextField } from "@mui/material";
import { setBaseURL } from "../../axiosConfig/Axios";
const Home = () => {
    let url = localStorage.getItem("url");
    const [inputUrl, setInputUrl] = useState(url.split("http://")[1] || "");
    const handleNewUrl = () => {
        localStorage.setItem("url", "http://" + inputUrl);
        setBaseURL("http://" + inputUrl);
    };

    const location = useLocation();

    return (
        <div className="home-main">
            <div className="url-main">
                <div className="url-main-inner">
                    <p>Backend Address</p>
                    <TextField
                        label="url"
                        value={inputUrl}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => setInputUrl(e.target.value)}
                        // placeholder="member of"
                    />
                    <div className="button-div">
                        <Button variant="outlined" onClick={() => setShowUrlInput(false)}>
                            go back
                        </Button>
                        <Link to={"/data"}>
                            <Button variant="contained" onClick={() => handleNewUrl()}>
                                proceed
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

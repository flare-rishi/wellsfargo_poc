import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import AppWrapper from './store/AppWrapper';
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

const theme = createTheme({
    palette: {
        primary: {
            light: "rgb(234, 145, 94)",
            main: "rgb(234, 145, 94)",
            dark: "rgb(234, 145, 94)",
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <App />
                <Toaster
                    position="bottom-left"
                    reverseOrder={false}
                    toastOptions={{
                        limit: 3,
                        duration: 3000, // Set the duration in milliseconds (e.g., 3000ms for 3 seconds)
                        style: {
                            background: "#333",
                            color: "#fff",
                        },
                        // Additional toast options can be added here
                    }}
                />
            </BrowserRouter>
        </ThemeProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

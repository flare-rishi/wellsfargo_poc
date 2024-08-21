// src/api/client.js
import axios from "axios";
// import { setupCache } from "axios-cache-adapter";

import { URL } from "../constants/constants";

let baseURL = localStorage.getItem("url") || URL;

// Create cache adapter instance
// const cache = setupCache({
//   maxAge: 15 * 60 * 1000, // Cache for 15 minutes
// });

const Axios = axios.create({
    baseURL: baseURL,
    // adapter: cache.adapter,
});

export const setBaseURL = (newBaseURL) => {
    Axios.defaults.baseURL = newBaseURL;
};

// Request Interceptor
Axios.interceptors.request.use(
    (config) => {
        // Add any custom headers or tokens here
        return config;
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error);
    }
);

// Response Interceptor
Axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle response errors here
        if (error.response) {
            // Handle specific HTTP errors
            if (error.response.status === 401) {
                // Handle unauthorized error
            } else if (error.response.status === 404) {
                console.log("45 from the axios ", error);
                // Handle not found error
            }
            // Add other specific status code handling if necessary
        } else {
            // Handle other errors like network issues
        }
        return Promise.reject(error);
    }
);

export default Axios;

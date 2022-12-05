import axios from "axios";

export const API = axios.create({
    baseURL: "https://1985-2404-8000-1004-b94f-981-cb38-ac28-b410.ap.ngrok.io/api/v1/",    
});

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common["Authorization"];
    };
}

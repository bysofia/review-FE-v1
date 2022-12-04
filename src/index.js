import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import { UserContextProvider } from "./components/contexts/userContext";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <UserContextProvider>
        <App />
      </UserContextProvider>
  </React.StrictMode>
);

reportWebVitals(console.log);

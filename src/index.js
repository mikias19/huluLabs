import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider } from "@apollo/client";
import client from "./ApolloClient";
if (window.Telegram && window.Telegram.WebApp) {
  console.log("Telegram WebApp initialized");
  window.Telegram.WebApp.ready();
} else {
  console.log("Telegram WebApp not available");
}
const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("GraphQL API URL:", process.env.REACT_APP_API_URL);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

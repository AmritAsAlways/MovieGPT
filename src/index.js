import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// ENTRY POINT: Create React App starts the whole app from this file.
// React takes over the <div id="root"> that lives in public/index.html and
// draws our <App /> inside it. Everything else is a child of <App />.
const root = ReactDOM.createRoot(document.getElementById("root"));

// <React.StrictMode> is intentionally left out (the original project also
// skips it). In development StrictMode runs every useEffect twice, which
// would fire our API calls and the Firebase auth listener twice and make
// the flow harder to follow while you are learning.
root.render(<App />);

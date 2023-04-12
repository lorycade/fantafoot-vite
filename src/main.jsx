import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";

import UserContextProvider from "./context/UserContext";
import StageContextProvider from "./context/StageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <StageContextProvider>
      <App />
    </StageContextProvider>
  </UserContextProvider>
);

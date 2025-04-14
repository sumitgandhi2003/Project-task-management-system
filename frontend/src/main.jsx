import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Components/App/App.jsx";
import { LoginProvider } from "./context/loginContext.jsx";
import { UserProvider } from "./context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <UserProvider>
    <LoginProvider>
      <App />
    </LoginProvider>
  </UserProvider>
  // </StrictMode>
);

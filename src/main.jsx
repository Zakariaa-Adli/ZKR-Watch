import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { WatchlistProvider } from "./context/WatchlistContext";
import { TrailerProvider } from "./context/TrailerContext";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <WatchlistProvider>
        <TrailerProvider>
          <App />
        </TrailerProvider>
      </WatchlistProvider>
    </BrowserRouter>
  </StrictMode>,
);

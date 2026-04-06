import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import the CSS file you created above
import "./styles.css";

// Import your main App component
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
<StrictMode>
<App />
</StrictMode>
);

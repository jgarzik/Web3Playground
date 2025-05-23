import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "Jeff's Hacker Haven - Web3 Development Playground";

createRoot(document.getElementById("root")!).render(<App />);

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "Hemi Playground - Web3 NFT Hub";

createRoot(document.getElementById("root")!).render(<App />);

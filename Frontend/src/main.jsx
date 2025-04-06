import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./Contexts/AuthContext.jsx";
import App from "./App.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <Toaster richColors/>
        <App />
    </AuthProvider>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./Contexts/AuthContext.jsx";
import App from "./App.jsx";
import CartProvider from "./Contexts/CartContext.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <CartProvider>
            <Toaster richColors />
            <App />
        </CartProvider>
    </AuthProvider>
);

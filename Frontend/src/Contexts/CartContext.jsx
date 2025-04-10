import { useState, useEffect, createContext } from "react";
import { API_URL } from "../config/api";

export const CartLength = createContext();

const CartProvider = ({ children }) => {
    const [cartLen, setCartLen] = useState(0);

    async function fetchCart() {
        const res = await fetch(`${API_URL}/api/cart/count`, {
            credentials : "include"
        });
        const data = await res.json();
        setCartLen(data.itemCount);
    }

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartLength.Provider value={{ cartLen, fetchCart }}>
            {children}
        </CartLength.Provider>
    );
};

export default CartProvider;

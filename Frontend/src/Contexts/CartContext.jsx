import { useState, useEffect, createContext } from "react";
import { API_URL } from "../config/api";

export const CartLength = createContext();

const CartProvider = ({ children }) => {
    const [cartLen, setCartLen] = useState(0);
    const [products, setProducts] = useState([]);
    const [outOfStock, setOutOfStock] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchCart() {
        const response = await fetch(`${API_URL}/api/cart/user`, {
            credentials: "include",
        });
        const products = await response.json();

        if (products.length === 0) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
        setProducts(products.filter((product) => product.inStock));
        setOutOfStock(products.filter((product) => !product.inStock));
    }

    async function fetchTotal() {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/cart/total`, {
            credentials: "include",
        });
        const data = await response.json();
        setSubTotal(data.mrp);

        setTotal(data.totalPrice + shippingCost);
        setIsLoading(false);
    }

    async function fetchCartLen() {
        const res = await fetch(`${API_URL}/api/cart/count`, {
            credentials: "include",
        });
        const data = await res.json();
        setCartLen(data.itemCount);
    }

    useEffect(() => {
        Promise.all([fetchCart(), fetchTotal(), fetchCartLen()]);
    }, []);

    return (
        <CartLength.Provider
            value={{
                cartLen,
                fetchCartLen,
                total,
                subTotal,
                outOfStock,
                products,
                isLoading,
                setIsLoading,
                fetchCart,
            }}
        >
            {children}
        </CartLength.Provider>
    );
};

export default CartProvider;

import { createContext, useContext, useState, useEffect } from "react";

const orderDataContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderData, setData] = useState({});
    const setOrderData = (data) => {
        setData(data);
    };

    useEffect(() => {
      setData(localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : {});
    }, [])
    
    return (
        <orderDataContext.Provider value={{ orderData, setOrderData }}>
            {children}
        </orderDataContext.Provider>
    );
};

export const useOrder = () => useContext(orderDataContext);

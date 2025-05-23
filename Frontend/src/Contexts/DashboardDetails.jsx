import { useContext } from "react";
import { createContext, useState, useEffect } from "react";
import { API_URL } from "../config/api";

const dashboardDetails = createContext();

export const DashboardProvider = ({ children }) => {
    const [totalOrders, setTotalOrders] = useState(null);
    const [orderPercentage, setOrderPercentage] = useState(null);
    const [totalProducts, setTotalProducts] = useState(null);
    const [thisMonthProducts, setThisMonthProducts] = useState(null);
    const [activeUsers, setActiveUsers] = useState(null);
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [revenuePercentage, setRevenuePercentage] = useState(null);
    const [ordersData, setOrdersData] = useState([
        { name: "Jan", revenue: 0, orders: 0 },
        { name: "Feb", revenue: 0, orders: 0 },
        { name: "Mar", revenue: 0, orders: 0 },
        { name: "Apr", revenue: 0, orders: 0 },
        { name: "May", revenue: 0, orders: 0 },
        { name: "Jun", revenue: 0, orders: 0 },
        { name: "Jul", revenue: 0, orders: 0 },
        { name: "Aug", revenue: 0, orders: 0 },
        { name: "Sep", revenue: 0, orders: 0 },
        { name: "Oct", revenue: 0, orders: 0 },
        { name: "Nov", revenue: 0, orders: 0 },
        { name: "Dec", revenue: 0, orders: 0 },
    ]);

    const fetchTotalProducts = async () => {
        const response = await fetch(`${API_URL}/api/products/total`, {
            credentials: "include",
        });
        const data = await response.json();
        let total = 0;
        data.monthlyProducts.forEach((item) => (total += item.count));
        setTotalProducts(total);
        setThisMonthProducts(
            data.monthlyProducts[data.monthlyProducts.length - 1]?.count ?? 0
        );
    };

    const fetchTotalOrders = async () => {
        const response = await fetch(`${API_URL}/api/orders/revenue`, {
            credentials: "include",
        });
        const data = await response.json();
        const thisMonth =
            data.monthlyRevenue[data.monthlyRevenue.length - 1]?.orderCount ??
            0;
        const lastMonth =
            data.monthlyRevenue[data.monthlyRevenue.length - 2]?.orderCount ??
            0;
        setOrderPercentage(
            lastMonth
                ? ((thisMonth - lastMonth) / lastMonth) * 100
                : thisMonth * 100
        );
        setTotalOrders(thisMonth);
        data.monthlyRevenue.forEach((item) => {
            setOrdersData((prev) => {
                const updated = [...prev];
                updated[item._id.month - 1].revenue = item.totalRevenue;
                updated[item._id.month - 1].orders = item.orderCount;
                return updated;
            });
        });
    };

    const fetchActiveUsers = async () => {
        const response = await fetch(`${API_URL}/api/users/active`, {
            credentials: "include",
        });
        const data = await response.json();
        setActiveUsers(data.thisMonth);
    };

    const fetchTotalRevenue = async () => {
        const response = await fetch(`${API_URL}/api/orders/revenue`, {
            credentials: "include",
        });
        const data = await response.json();
        const thisMonth =
            data.monthlyRevenue[data.monthlyRevenue.length - 1]?.totalRevenue ||
            0;
        const lastMonth =
            data.monthlyRevenue[data.monthlyRevenue.length - 2]?.totalRevenue ||
            0;
        setRevenuePercentage(
            lastMonth
                ? ((thisMonth - lastMonth) / lastMonth) * 100
                : thisMonth * 100
        );
        setTotalRevenue(thisMonth);
    };

    useEffect(() => {
        Promise.all([
            fetchTotalOrders(),
            fetchTotalProducts(),
            fetchActiveUsers(),
            fetchTotalRevenue(),
        ]);
    }, []);

    return (
        <dashboardDetails.Provider
            value={{
                totalOrders,
                totalProducts,
                orderPercentage,
                thisMonthProducts,
                activeUsers,
                totalRevenue,
                revenuePercentage,
                ordersData,
            }}
        >
            {children}
        </dashboardDetails.Provider>
    );
};

export const useDashDetails = () => useContext(dashboardDetails);
;

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    DollarSign,
    Package,
    ShoppingCart,
    Users,
} from "lucide-react";
import { RecentOrdersTable } from "./RecentOrdersTable";
import { SalesChart } from "./SalesChart";
import { LowStockTable } from "./LowStockTable";
import OrderStatus from "../../components/Admin/OrderStatus";
import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import clsx from "clsx";

export default function DashboardOverview() {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [revenuePercentage, setRevenuePercentage] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [orderPercentage, setOrderPercentage] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [thisMonthProducts, setThisMonthProducts] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [activeUsersPercentage, setActiveUsersPercentage] = useState(0);

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

    const fetchTotalProducts = async () => {
        const response = await fetch(`${API_URL}/api/products/total`, {
            credentials: "include",
        });
        const data = await response.json();
        let totalProducts = 0;
        data.monthlyProducts.forEach((item) => (totalProducts += item.count));
        setTotalProducts(totalProducts);
        setThisMonthProducts(
            data.monthlyProducts[data.monthlyProducts.length - 1]?.count || 0
        );
    };

    const fetchTotalOrders = async () => {
        const response = await fetch(`${API_URL}/api/orders/revenue`, {
            credentials: "include",
        });
        const data = await response.json();
        const thisMonth =
            data.monthlyRevenue[data.monthlyRevenue.length - 1]?.orderCount ||
            0;
        const lastMonth =
            data.monthlyRevenue[data.monthlyRevenue.length - 2]?.orderCount ||
            0;
        setOrderPercentage(
            lastMonth
                ? ((thisMonth - lastMonth) / lastMonth) * 100
                : thisMonth * 100
        );
        setTotalOrders(thisMonth);
    };

    const fetchActiveUsers = async () => {
        const response = await fetch(`${API_URL}/api/users/active`, {
            credentials: "include",
        });
        const data = await response.json();
        const thisMonth = data.thisMonth;
        const lastMonth = data.lastMonth;
        setActiveUsers(thisMonth);
        setActiveUsersPercentage(
            lastMonth
                ? ((thisMonth - lastMonth) / lastMonth) * 100
                : thisMonth * 100
        );
    };

    useEffect(() => {
        Promise.all([
            fetchTotalOrders(),
            fetchTotalRevenue(),
            fetchTotalProducts(),
            fetchActiveUsers(),
        ]);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's an overview of your store.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{totalRevenue}.00
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span
                                className={clsx(
                                    "flex items-center text-emerald-500",
                                    { "text-red-500": revenuePercentage < 0 }
                                )}
                            >
                                {revenuePercentage < 0 ? (
                                    <ArrowDownIcon className="mr-1 h-3 w-3" />
                                ) : (
                                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                                )}
                                {revenuePercentage}%
                            </span>
                            <span>from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalOrders}</div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span
                                className={clsx(
                                    "flex items-center text-emerald-500",
                                    { "text-red-500": orderPercentage < 0 }
                                )}
                            >
                                {orderPercentage < 0 ? (
                                    <ArrowDownIcon className="mr-1 h-3 w-3" />
                                ) : (
                                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                                )}
                                {orderPercentage}%
                            </span>
                            <span>from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Products
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalProducts}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span
                                className={clsx(
                                    "flex items-center text-emerald-500",
                                    { "text-red-500": orderPercentage < 0 }
                                )}
                            >
                                + {thisMonthProducts}
                            </span>
                            <span>this month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{activeUsers}</div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            
                            <span>this month</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <h1 className="text-xl font-semibold ml-2">Overview</h1>
            <div className="flex gap-5 max-lg:flex-col ">
                <Card className="w-1/2 max-lg:w-full">
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                        <CardDescription>
                            View your sales performance over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesChart />
                    </CardContent>
                </Card>
                <Card className="w-1/2 max-lg:w-full">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            Latest orders from your customers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentOrdersTable />
                    </CardContent>
                </Card>
            </div>
            <div className="flex gap-5 max-lg:flex-col">
                <Card className="w-1/2 max-lg:w-full">
                    <CardHeader>
                        <CardTitle>Low Stock Alert</CardTitle>
                        <CardDescription>
                            Products that need to be restocked soon
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LowStockTable />
                    </CardContent>
                </Card>
                <Card className="w-1/2 h-max max-lg:w-full">
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                        <CardDescription>
                            Distribution of orders by status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrderStatus></OrderStatus>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

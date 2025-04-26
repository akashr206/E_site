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
import { Skeleton } from "../../components/ui/skeleton";
import TotalRevenue from "../../components/Admin/TotalRevenue";
import { formatIndianNumber as FIN } from "../../lib/utils";

export default function DashboardOverview() {
    const [totalOrders, setTotalOrders] = useState(null);
    const [orderPercentage, setOrderPercentage] = useState(null);
    const [totalProducts, setTotalProducts] = useState(null);
    const [thisMonthProducts, setThisMonthProducts] = useState(null);
    const [activeUsers, setActiveUsers] = useState(null);
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
            data.monthlyRevenue[data.monthlyRevenue.length - 1]?.orderCount ?? 0;
        const lastMonth =
            data.monthlyRevenue[data.monthlyRevenue.length - 2]?.orderCount ?? 0;
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

    useEffect(() => {
        Promise.all([
            fetchTotalOrders(),
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
                <TotalRevenue />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalOrders !== null ? (
                                `+${FIN(totalOrders)}`
                            ) : (
                                <Skeleton className="h-7 w-12" />
                            )}
                        </div>
                        {orderPercentage !== null ? (
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span
                                    className={clsx(
                                        "flex items-center",
                                        orderPercentage < 0
                                            ? "text-red-500"
                                            : "text-emerald-500"
                                    )}
                                >
                                    {orderPercentage < 0 ? (
                                        <ArrowDownIcon className="mr-1 h-3 w-3" />
                                    ) : (
                                        <ArrowUpIcon className="mr-1 h-3 w-3" />
                                    )}
                                    {orderPercentage.toFixed(2)}%
                                </span>
                                <span>from last month</span>
                            </div>
                        ) : (
                            <Skeleton className="w-24 mt-2 h-4" />
                        )}
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
                            {totalProducts !== null ? (
                                FIN(totalProducts)
                            ) : (
                                <Skeleton className="h-7 w-12" />
                            )}
                        </div>
                        {thisMonthProducts !== null ? (
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span
                                    className={clsx(
                                        "flex items-center",
                                        thisMonthProducts === 0
                                            ? "text-muted-foreground"
                                            : "text-emerald-500"
                                    )}
                                >
                                    + {FIN(thisMonthProducts)}
                                </span>
                                <span>this month</span>
                            </div>
                        ) : (
                            <Skeleton className="w-24 mt-2 h-4" />
                        )}
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
                        <div className="text-2xl font-bold">
                            {activeUsers !== null ? (
                                `+${FIN(activeUsers)}`
                            ) : (
                                <Skeleton className="h-7 w-12" />
                            )}
                        </div>
                        {activeUsers !== null ? (
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>this month</span>
                            </div>
                        ) : (
                            <Skeleton className="w-24 mt-2 h-4" />
                        )}
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
                        <SalesChart data={ordersData} />
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
                        <OrderStatus />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

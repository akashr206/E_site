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
import { useDashDetails } from "../../Contexts/DashboardDetails";

export default function DashboardOverview() {
    const {totalOrders, orderPercentage, totalProducts ,thisMonthProducts, activeUsers, ordersData } = useDashDetails();

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

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesChart } from "./SalesChart";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { API_URL } from "../../config/api";
import { useEffect, useState } from "react";
import TotalRevenue from "../../components/Admin/TotalRevenue";
import clsx from "clsx";
import { formatIndianNumber as FIN } from "../../lib/utils";
import { Skeleton } from "../../components/ui/skeleton";

const categoryData = [
    { name: "Clothing", value: 45 },
    { name: "Footwear", value: 20 },
    { name: "Accessories", value: 15 },
    { name: "Winter", value: 12 },
    { name: "Others", value: 8 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const productPerformanceData = [
    { name: "Cotton T-Shirt", sales: 120, revenue: 71880 },
    { name: "Denim Jeans", sales: 80, revenue: 103920 },
    { name: "Leather Jacket", sales: 40, revenue: 99960 },
    { name: "Silk Scarf", sales: 60, revenue: 53940 },
    { name: "Wool Sweater", sales: 50, revenue: 74950 },
];

export default function AnalyticsPage() {
    const { theme } = useTheme();
    const [ordersData, setOrdersData] = useState([]);
    const [averageOrderValue, setAverageOrderValue] = useState(null);
    const [UsersCount, setUsersCount] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState(null);
    const [zeroStock, setZeroStock] = useState(null);
    const [totalProducts, setTotalProducts] = useState(null);
    const [thisMonthProducts, setThisMonthProducts] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTotalOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/api/orders/revenue`, {
                credentials: "include",
            });
            const data = await response.json();
            let prev = [
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
            ];
            data.monthlyRevenue.forEach((item) => {
                setOrdersData(() => {
                    prev[item._id.month - 1].revenue = item.totalRevenue;
                    return prev;
                });
                setOrdersData(() => {
                    prev[item._id.month - 1].orders = item.orderCount;
                    return prev;
                });
            });
            setAverageOrderValue({
                value:
                    data.monthlyRevenue.length > 0 
                        ? data.monthlyRevenue[data.monthlyRevenue.length - 1]
                              ?.totalRevenue /
                          data.monthlyRevenue[data.monthlyRevenue.length - 1]?.orderCount || 0
                        : 0,
                prevValue:
                    data.monthlyRevenue.length > 1
                        ? data.monthlyRevenue[data.monthlyRevenue.length - 2]
                              ?.totalRevenue /
                          data.monthlyRevenue[data.monthlyRevenue.length - 2]
                              ?.orderCount || 0
                        : 0,
            });
        } catch (error) {
            console.error("Error fetching orders data:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/users/count`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setUsersCount({
                    totalUsers: data.totalUsers || 0,
                    lastMonthUsers: data.lastMonthUsers || 0,
                    frequency: data.frequency || 0
                });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsersCount({
                totalUsers: 0,
                lastMonthUsers: 0,
                frequency: 0
            });
        }
    };

    const fetchTotalProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/products/total`, {
                credentials: "include",
            });
            const data = await response.json();
            let totalProductsCount = 0;
            data.monthlyProducts.forEach((item) => (totalProductsCount += item.count));
            setTotalProducts(totalProductsCount);
            setThisMonthProducts(
                data.monthlyProducts.length > 0 
                    ? data.monthlyProducts[data.monthlyProducts.length - 1]?.count || 0
                    : 0
            );
        } catch (error) {
            console.error("Error fetching products data:", error);
            setTotalProducts(0);
            setThisMonthProducts(0);
        }
    };

    const fetchLowStock = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products/low`, {
                credentials : "include"
            });
            const data = await res.json();
            
            let lowStockCount = 0;
            data.products.forEach((product) => {
                if (parseInt(product.variant.stock, 10) <= 4) {
                    lowStockCount++;
                }
            });
            setLowStockProducts(lowStockCount);
            
            const zeroStockCount = data.products.filter(
                (product) => parseInt(product.variant.stock, 10) === 0
            ).length;
            setZeroStock(zeroStockCount);
        } catch (error) {
            console.error("Error fetching low stock products:", error);
            setLowStockProducts(0);
            setZeroStock(0);
        }
    };

    const isDark = theme === "dark";

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchTotalOrders(),
                fetchUsers(),
                fetchLowStock(),
                fetchTotalProducts(),
            ]);
            setIsLoading(false);
        };
        
        fetchAllData();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Analyze your store's performance with detailed reports and
                    insights.
                </p>
            </div>

            <div className="flex items-center justify-between">
                <Tabs defaultValue="sales" className="w-full">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="sales">Sales</TabsTrigger>
                            <TabsTrigger value="products">Products</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="sales" className="space-y-4 mt-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <TotalRevenue />
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Average Order Value
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {!isLoading ? (
                                            `₹${FIN(
                                                (averageOrderValue?.value || 0).toFixed(2)
                                            )}`
                                        ) : (
                                            <Skeleton className="h-7 w-14" />
                                        )}
                                    </div>
                                    {!isLoading ? (
                                        <>
                                            <p
                                                className={clsx(
                                                    "text-xs inline",
                                                    (averageOrderValue?.value || 0) >
                                                        (averageOrderValue?.prevValue || 0)
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                )}
                                            >
                                                +
                                                {averageOrderValue?.prevValue
                                                    ? (
                                                          ((averageOrderValue.value -
                                                              averageOrderValue.prevValue) /
                                                              averageOrderValue.prevValue) *
                                                          100
                                                      ).toFixed(2)
                                                    : (
                                                          (averageOrderValue?.value || 0) *
                                                          100
                                                      ).toFixed(2)}
                                                %
                                            </p>
                                            <span className="text-sm text-muted-foreground mx-1">
                                                from last month
                                            </span>
                                        </>
                                    ) : (
                                        <Skeleton className="w-24 mt-2 h-4" />
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Customers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {!isLoading ? (
                                            FIN(UsersCount?.totalUsers || 0)
                                        ) : (
                                            <Skeleton className="h-7 w-16" />
                                        )}
                                    </div>
                                    {!isLoading ? (
                                        <p className="text-xs text-muted-foreground">
                                            +
                                            {FIN(
                                                UsersCount?.lastMonthUsers || 0
                                            )}{" "}
                                            new this month
                                        </p>
                                    ) : (
                                        <Skeleton className="w-28 mt-2 h-4" />
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Average Order Frequency
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {!isLoading ? (
                                            UsersCount?.frequency || 0
                                        ) : (
                                            <Skeleton className="h-7 w-10" />
                                        )}
                                    </div>
                                    {!isLoading ? (
                                        <p className="text-xs text-muted-foreground">
                                            orders per customer
                                        </p>
                                    ) : (
                                        <Skeleton className="w-28 mt-2 h-4" />
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Sales Overview</CardTitle>
                                    <CardDescription>
                                        Monthly revenue and order trends
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <SalesChart data={ordersData} />
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Sales by Category</CardTitle>
                                    <CardDescription>
                                        Distribution of sales across product
                                        categories
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) =>
                                                    `${name} ${(
                                                        percent * 100
                                                    ).toFixed(0)}%`
                                                }
                                            >
                                                {categoryData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: isDark
                                                        ? "#333"
                                                        : "#fff",
                                                    color: isDark
                                                        ? "#fff"
                                                        : "#333",
                                                    border: `1px solid ${
                                                        isDark ? "#444" : "#ddd"
                                                    }`,
                                                }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="products" className="space-y-4 mt-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Products
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {!isLoading ? FIN(totalProducts || 0) : <Skeleton className="h-7 w-16" />}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {!isLoading ? `+${FIN(thisMonthProducts || 0)} new this month` : <Skeleton className="w-28 mt-2 h-4" />}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Top Selling Category
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        Clothing
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        45% of total sales
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Low Stock Products
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!isLoading ? (
                                        <>
                                            <div className="text-2xl font-bold">
                                                {FIN(lowStockProducts || 0)}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Needs attention
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Skeleton className="h-7 w-16" />
                                            <Skeleton className="w-24 mt-2 h-4" />
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Out of Stock
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!isLoading ? (
                                        <>
                                            <div className="text-2xl font-bold">
                                                {FIN(zeroStock || 0)}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Requires restock
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Skeleton className="h-7 w-10" />
                                            <Skeleton className="w-24 mt-2 h-4" />
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Product Performance</CardTitle>
                                <CardDescription>
                                    Top performing products by sales and revenue
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart
                                        data={productPerformanceData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke={isDark ? "#333" : "#eee"}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke={isDark ? "#888" : "#333"}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            orientation="left"
                                            stroke="#8884d8"
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            stroke="#82ca9d"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDark
                                                    ? "#333"
                                                    : "#fff",
                                                color: isDark ? "#fff" : "#333",
                                                border: `1px solid ${
                                                    isDark ? "#444" : "#ddd"
                                                }`,
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="sales"
                                            name="Units Sold"
                                            fill="#8884d8"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            yAxisId="right"
                                            dataKey="revenue"
                                            name="Revenue (₹)"
                                            fill="#82ca9d"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
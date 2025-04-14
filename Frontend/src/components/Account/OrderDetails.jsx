import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    CreditCard,
    Truck,
    Calendar,
    Clock,
    AlertCircle,
    Home,
    Briefcase,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../../config/api";

const OrderDetails = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("id");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/orders/${orderId}`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Error ${response.status}: ${response.statusText}`
                    );
                }

                const data = await response.json();

                if (!data || !data.order) {
                    throw new Error("Invalid response format");
                }
                console.log(data.order);

                setOrder(data.order);
                setLoading(false);
            } catch (err) {
                setError(
                    err.message ||
                        "Failed to fetch order details. Please try again later."
                );
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        } else {
            setError("Order ID is missing");
            setLoading(false);
        }
    }, [orderId]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "warning";
            case "confirmed":
                return "secondary";
            case "shipped":
                return "info";
            case "delivered":
                return "success";
            case "cancelled":
                return "destructive";
            case "paid":
                return "success";
            case "failed":
                return "destructive";
            case "refunded":
                return "warning";
            default:
                return "default";
        }
    };

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button variant="outline" asChild>
                        <Link to="?tab=orders">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Button variant="outline" className="mb-6" asChild>
                    <Link to="?tab=orders">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Orders
                    </Link>
                </Button>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-36" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Button variant="outline" className="mb-6" asChild>
                    <Link to="?tab=orders">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Orders
                    </Link>
                </Button>
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Not Found</AlertTitle>
                    <AlertDescription>
                        Order not found or has been removed.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Button variant="outline" className="mb-6" asChild>
                <Link to="?tab=orders">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Link>
            </Button>

            <Card className="mb-6">
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <CardTitle className="text-2xl">
                                Order #{order._id && order._id.substring(0, 8)}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1">
                                <Calendar className="mr-1 h-3.5 w-3.5" />
                                Placed on {formatDate(order.orderDate)}
                            </CardDescription>
                        </div>
                        <Badge
                            variant={getStatusColor(order.status)}
                            className="mt-2 sm:mt-0"
                        >
                            {order.status &&
                                order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                        </Badge>
                    </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                    <Tabs defaultValue="items">
                        <TabsList className="mb-4">
                            <TabsTrigger value="items">Order Items</TabsTrigger>
                            <TabsTrigger value="details">
                                Shipping & Payment
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="items">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center">
                                        <Package className="mr-2 h-5 w-5" />
                                        Items (
                                        {(order.items && order.items.length) ||
                                            0}
                                        )
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead>Variant</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead className="text-right">
                                                    Price
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items &&
                                                order.items.map(
                                                    (item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-medium">
                                                                <Link
                                                                    to={`/products/${item.productId}`}
                                                                >
                                                                    {
                                                                        item.productName
                                                                    }
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.variant ? (
                                                                    <span>
                                                                        {item
                                                                            .variant
                                                                            .color &&
                                                                            `Color: ${item.variant.color}`}
                                                                        {item
                                                                            .variant
                                                                            .color &&
                                                                            item
                                                                                .variant
                                                                                .size &&
                                                                            " / "}
                                                                        {item
                                                                            .variant
                                                                            .size &&
                                                                            `Size: ${item.variant.size}`}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted-foreground">
                                                                        No
                                                                        variant
                                                                    </span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.quantity}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="text-xs text-muted-foreground">
                                                                    ₹
                                                                    {item.price &&
                                                                        item.price.toFixed(
                                                                            2
                                                                        )}{" "}
                                                                    each
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card className="mt-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Subtotal
                                            </span>
                                            <span>
                                                ₹
                                                {order.summary &&
                                                    order.summary.subTotal &&
                                                    order.summary.subTotal.toFixed(
                                                        2
                                                    )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Shipping
                                            </span>
                                            <span>
                                                ₹
                                                {order.summary &&
                                                    order.summary
                                                        .shippingCost &&
                                                    order.summary.shippingCost.toFixed(
                                                        2
                                                    )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                Tax
                                            </span>
                                            <span>
                                                ₹
                                                {order.summary &&
                                                    order.summary.tax &&
                                                    order.summary.tax.toFixed(
                                                        2
                                                    )}
                                            </span>
                                        </div>
                                        {order.summary &&
                                            order.summary.discount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Discount</span>
                                                    <span>
                                                        - ₹
                                                        {order.summary.discount.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-medium text-lg">
                                            <span>Total</span>
                                            <span>
                                                ₹
                                                {order.summary &&
                                                    order.summary.totalAmount &&
                                                    order.summary.totalAmount.toFixed(
                                                        2
                                                    )}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="details">
                            <div className="grid gap-6">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center">
                                            <Truck className="mr-2 h-5 w-5" />
                                            Shipping Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                                    Delivery Address
                                                </h4>
                                                <div>
                                                    <p className="font-medium flex items-center gap-2">
                                                        <span className="">
                                                            {order.shippingAddress &&
                                                            order
                                                                .shippingAddress
                                                                .tag ===
                                                                "Home" ? (
                                                                <Home
                                                                    size={18}
                                                                />
                                                            ) : order.shippingAddress &&
                                                              order
                                                                  .shippingAddress
                                                                  .tag ===
                                                                  "Work" ? (
                                                                <Briefcase
                                                                    size={18}
                                                                />
                                                            ) : (
                                                                ""
                                                            )}
                                                        </span>
                                                        {order.shippingAddress &&
                                                            order
                                                                .shippingAddress
                                                                .tag}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {order.shippingAddress &&
                                                            order
                                                                .shippingAddress
                                                                .street}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {order.shippingAddress &&
                                                            order
                                                                .shippingAddress
                                                                .city}
                                                        {order.shippingAddress &&
                                                            ", "}
                                                        {order.shippingAddress &&
                                                            order
                                                                .shippingAddress
                                                                .state}{" "}
                                                        {order.shippingAddress &&
                                                            order
                                                                .shippingAddress
                                                                .postalCode}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {order.shippingAddress &&
                                                            order
                                                                .shippingAddress
                                                                .phone}
                                                    </p>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">
                                                        Method
                                                    </span>
                                                    <span className="capitalize">
                                                        {order.shipping &&
                                                            order.shipping
                                                                .method}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">
                                                        Status
                                                    </span>
                                                    <Badge
                                                        variant={getStatusColor(
                                                            order.shipping &&
                                                                order.shipping
                                                                    .status
                                                        )}
                                                    >
                                                        {order.shipping &&
                                                            order.shipping
                                                                .status &&
                                                            order.shipping.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                order.shipping.status.slice(
                                                                    1
                                                                )}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">
                                                        Estimated Delivery
                                                    </span>
                                                    <span>
                                                        {formatDate(
                                                            order.shipping &&
                                                                order.shipping
                                                                    .estimatedDeliveryDate
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center">
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Payment Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">
                                                        Method
                                                    </span>
                                                    <span className="uppercase">
                                                        {order.payment &&
                                                            order.payment
                                                                .method}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">
                                                        Status
                                                    </span>
                                                    <Badge
                                                        variant={getStatusColor(
                                                            order.payment &&
                                                                order.payment
                                                                    .status
                                                        )}
                                                    >
                                                        {order.payment &&
                                                            order.payment
                                                                .status &&
                                                            order.payment.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                order.payment.status.slice(
                                                                    1
                                                                )}
                                                    </Badge>
                                                </div>
                                                {order.payment &&
                                                    order.payment
                                                        .transactionId && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-muted-foreground">
                                                                Transaction ID
                                                            </span>
                                                            <span className="font-mono text-sm">
                                                                {
                                                                    order
                                                                        .payment
                                                                        .transactionId
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Notes */}
                            {order.notes && (
                                <Card className="mt-6">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">
                                            Order Notes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="whitespace-pre-line">
                                            {order.notes}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderDetails;

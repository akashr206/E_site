import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    MoreHorizontal,
    Search,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const orders = [
    {
        id: "ORD-001",
        userId: "USR-001",
        customerName: "John Doe",
        orderDate: new Date("2023-04-10"),
        items: [
            {
                productId: "PRD-001",
                productName: "Cotton T-Shirt",
                variant: { color: "Black", size: "M" },
                quantity: 2,
                price: 599,
            },
            {
                productId: "PRD-007",
                productName: "Leather Wallet",
                variant: { color: "Brown", size: "Free Size" },
                quantity: 1,
                price: 799,
            },
        ],
        payment: {
            method: "card",
            status: "paid",
            transactionId: "TXN-001",
        },
        shipping: {
            method: "standard",
            status: "delivered",
            estimatedDeliveryDate: new Date("2023-04-15"),
        },
        summary: {
            subTotal: 1997,
            tax: 359.46,
            shippingCost: 99,
            discount: 200,
            totalAmount: 2255.46,
        },
        status: "delivered",
    },
    {
        id: "ORD-002",
        userId: "USR-002",
        customerName: "Jane Smith",
        orderDate: new Date("2023-04-09"),
        items: [
            {
                productId: "PRD-003",
                productName: "Leather Jacket",
                variant: { color: "Brown", size: "L" },
                quantity: 1,
                price: 2499,
            },
        ],
        payment: {
            method: "upi",
            status: "paid",
            transactionId: "TXN-002",
        },
        shipping: {
            method: "express",
            status: "shipped",
            estimatedDeliveryDate: new Date("2023-04-12"),
        },
        summary: {
            subTotal: 2499,
            tax: 449.82,
            shippingCost: 199,
            discount: 0,
            totalAmount: 3147.82,
        },
        status: "shipped",
    },
    {
        id: "ORD-003",
        userId: "USR-003",
        customerName: "Robert Johnson",
        orderDate: new Date("2023-04-09"),
        items: [
            {
                productId: "PRD-005",
                productName: "Wool Sweater",
                variant: { color: "Grey", size: "M" },
                quantity: 1,
                price: 1499,
            },
            {
                productId: "PRD-006",
                productName: "Canvas Shoes",
                variant: { color: "White", size: "8" },
                quantity: 1,
                price: 999,
            },
        ],
        payment: {
            method: "card",
            status: "paid",
            transactionId: "TXN-003",
        },
        shipping: {
            method: "standard",
            status: "confirmed",
            estimatedDeliveryDate: new Date("2023-04-16"),
        },
        summary: {
            subTotal: 2498,
            tax: 449.64,
            shippingCost: 99,
            discount: 0,
            totalAmount: 3046.64,
        },
        status: "confirmed",
    },
    {
        id: "ORD-004",
        userId: "USR-004",
        customerName: "Emily Davis",
        orderDate: new Date("2023-04-08"),
        items: [
            {
                productId: "PRD-004",
                productName: "Silk Scarf",
                variant: { color: "Red", size: "Free Size" },
                quantity: 1,
                price: 899,
            },
        ],
        payment: {
            method: "cod",
            status: "pending",
            transactionId: "",
        },
        shipping: {
            method: "standard",
            status: "pending",
            estimatedDeliveryDate: new Date("2023-04-15"),
        },
        summary: {
            subTotal: 899,
            tax: 161.82,
            shippingCost: 99,
            discount: 0,
            totalAmount: 1159.82,
        },
        status: "pending",
    },
    {
        id: "ORD-005",
        userId: "USR-005",
        customerName: "Michael Wilson",
        orderDate: new Date("2023-04-07"),
        items: [
            {
                productId: "PRD-002",
                productName: "Denim Jeans",
                variant: { color: "Blue", size: "M" },
                quantity: 1,
                price: 1299,
            },
            {
                productId: "PRD-001",
                productName: "Cotton T-Shirt",
                variant: { color: "White", size: "M" },
                quantity: 2,
                price: 599,
            },
        ],
        payment: {
            method: "card",
            status: "refunded",
            transactionId: "TXN-005",
        },
        shipping: {
            method: "express",
            status: "cancelled",
            estimatedDeliveryDate: new Date("2023-04-10"),
        },
        summary: {
            subTotal: 2497,
            tax: 449.46,
            shippingCost: 199,
            discount: 0,
            totalAmount: 3145.46,
        },
        status: "cancelled",
    },
];

const getStatusBadge = (status) => {
    switch (status) {
        case "pending":
            return <Badge className="bg-yellow-500">Pending</Badge>;
        case "confirmed":
            return <Badge className="bg-blue-500">Confirmed</Badge>;
        case "shipped":
            return <Badge className="bg-purple-500">Shipped</Badge>;
        case "delivered":
            return <Badge className="bg-green-500">Delivered</Badge>;
        case "cancelled":
            return <Badge className="bg-red-500">Cancelled</Badge>;
        default:
            return <Badge>{status}</Badge>;
    }
};

const getPaymentStatusBadge = (status) => {
    switch (status) {
        case "pending":
            return (
                <Badge
                    variant="outline"
                    className="border-yellow-500 text-yellow-500"
                >
                    Pending
                </Badge>
            );
        case "paid":
            return (
                <Badge
                    variant="outline"
                    className="border-green-500 text-green-500"
                >
                    Paid
                </Badge>
            );
        case "failed":
            return (
                <Badge
                    variant="outline"
                    className="border-red-500 text-red-500"
                >
                    Failed
                </Badge>
            );
        case "refunded":
            return (
                <Badge
                    variant="outline"
                    className="border-blue-500 text-blue-500"
                >
                    Refunded
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">
                    View and manage customer orders, track shipments, and
                    process returns.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search orders..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">
                                    Confirmed
                                </SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">
                                    Delivered
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            {order.id}
                                        </TableCell>
                                        <TableCell>
                                            {order.customerName}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(order.orderDate)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(order.status)}
                                        </TableCell>
                                        <TableCell>
                                            {getPaymentStatusBadge(
                                                order.payment.status
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {order.items.length}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(
                                                order.summary.totalAmount
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                order
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        disabled={
                                                            order.status ===
                                                                "delivered" ||
                                                            order.status ===
                                                                "cancelled"
                                                        }
                                                    >
                                                        Update Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        disabled={
                                                            order.payment
                                                                .status !==
                                                            "paid"
                                                        }
                                                    >
                                                        Process Refund
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button variant="outline" size="sm">
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isDetailsOpen && (
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                Order Details - {selectedOrder.id}
                            </DialogTitle>
                            <DialogDescription>
                                View detailed information about this order.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium">
                                        Customer Information
                                    </h3>
                                    <p className="text-sm">
                                        {selectedOrder.customerName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        User ID: {selectedOrder.userId}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Order Information
                                    </h3>
                                    <p className="text-sm">
                                        Date:{" "}
                                        {formatDate(selectedOrder.orderDate)}
                                    </p>
                                    <p className="text-sm">
                                        Status: {selectedOrder.status}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Items</h3>
                                <div className="rounded-md border">
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
                                            {selectedOrder.items.map(
                                                (item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="font-medium">
                                                            {item.productName}
                                                        </TableCell>
                                                        <TableCell>{`${item.variant.color} / ${item.variant.size}`}</TableCell>
                                                        <TableCell>
                                                            {item.quantity}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {formatCurrency(
                                                                item.price
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium mb-2">
                                        Payment Information
                                    </h3>
                                    <p className="text-sm">
                                        Method: {selectedOrder.payment.method}
                                    </p>
                                    <p className="text-sm">
                                        Status: {selectedOrder.payment.status}
                                    </p>
                                    {selectedOrder.payment.transactionId && (
                                        <p className="text-sm">
                                            Transaction ID:{" "}
                                            {
                                                selectedOrder.payment
                                                    .transactionId
                                            }
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">
                                        Shipping Information
                                    </h3>
                                    <p className="text-sm">
                                        Method: {selectedOrder.shipping.method}
                                    </p>
                                    <p className="text-sm">
                                        Status: {selectedOrder.shipping.status}
                                    </p>
                                    <p className="text-sm">
                                        Estimated Delivery:{" "}
                                        {formatDate(
                                            selectedOrder.shipping
                                                .estimatedDeliveryDate
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">
                                    Order Summary
                                </h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span>
                                            {formatCurrency(
                                                selectedOrder.summary.subTotal
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Tax:</span>
                                        <span>
                                            {formatCurrency(
                                                selectedOrder.summary.tax
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Shipping:</span>
                                        <span>
                                            {formatCurrency(
                                                selectedOrder.summary
                                                    .shippingCost
                                            )}
                                        </span>
                                    </div>
                                    {selectedOrder.summary.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>Discount:</span>
                                            <span>
                                                -
                                                {formatCurrency(
                                                    selectedOrder.summary
                                                        .discount
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-medium">
                                        <span>Total:</span>
                                        <span>
                                            {formatCurrency(
                                                selectedOrder.summary
                                                    .totalAmount
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDetailsOpen(false);
                                    setSelectedOrder(null);
                                }}
                            >
                                Close
                            </Button>
                            {selectedOrder.status !== "delivered" &&
                                selectedOrder.status !== "cancelled" && (
                                    <Button>Update Status</Button>
                                )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Package } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const OrdersPreview = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders`, {
          credentials: "include",
        });
        const data = await response.json();
        setOrders(data.orders);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter orders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-20 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center text-red-500">
            {error}
          </CardContent>
        </Card>
      ) : filteredOrders?.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 flex flex-col">
          {filteredOrders?.map((order) => (
            <Link key={order._id} to={`?tab=details&id=${order._id}`}>
              <Card className="overflow-hidden hover:shadow-md transition duration-300 border-gray-200">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            Order #{order._id.substring(0, 8)}
                          </span>
                          <Badge className={getStatusStyle(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(order.orderDate)}
                        </div>
                        <div className="flex items-center text-sm">
                          <Package className="w-4 h-4 mr-1" />
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end mt-2 sm:mt-0">
                        <div className="font-medium text-lg">
                          ₹{order.summary.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.shipping.status === "delivered"
                            ? "Delivered on " + formatDate(order.shipping.estimatedDeliveryDate)
                            : "Est. delivery " + formatDate(order.shipping.estimatedDeliveryDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPreview;
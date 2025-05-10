import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const OrderStatus = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500">Pending</Badge>
                    <span className="text-sm">Pending Orders</span>
                </div>
                <span className="text-sm font-medium">24</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500">Confirmed</Badge>
                    <span className="text-sm">Confirmed Orders</span>
                </div>
                <span className="text-sm font-medium">42</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500">Shipped</Badge>
                    <span className="text-sm">Shipped Orders</span>
                </div>
                <span className="text-sm font-medium">56</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">Delivered</Badge>
                    <span className="text-sm">Delivered Orders</span>
                </div>
                <span className="text-sm font-medium">128</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge className="bg-red-500">Cancelled</Badge>
                    <span className="text-sm">Cancelled Orders</span>
                </div>
                <span className="text-sm font-medium">8</span>
            </div>
        </div>
    );
};

export default OrderStatus;

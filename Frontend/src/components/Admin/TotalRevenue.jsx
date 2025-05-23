import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DollarSign, ArrowUpIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import clsx from "clsx";
import { formatIndianNumber as FIN } from "../../lib/utils";
import { useDashDetails } from "../../Contexts/DashboardDetails";
const TotalRevenue = () => {
    const { totalRevenue, revenuePercentage} = useDashDetails()

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {totalRevenue !== null ? (
                        `₹${FIN(totalRevenue)}.00`
                    ) : (
                        <Skeleton className="h-7 w-14" />
                    )}
                </div>
                {totalRevenue !== null ? (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span
                            className={clsx(
                                "flex items-center text-emerald-500",
                                {
                                    "text-red-500": revenuePercentage < 0,
                                }
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
                ) : (
                    <Skeleton className="w-24 mt-2 h-4" />
                )}
            </CardContent>
        </Card>
    );
};

export default TotalRevenue;

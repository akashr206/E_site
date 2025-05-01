import { useEffect, useState, useContext } from "react";
import { API_URL } from "../config/api";
import { useOrder } from "../Contexts/orderDataContext";
import {
    Check,
    RefreshCw,
    AlertCircle,
    Package,
    Home,
    Receipt,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { CartLength } from "../Contexts/CartContext";

const SuccessPage = () => {
    const [status, setStatus] = useState("loading");
    const [orderDetails, setOrderDetails] = useState(null);
    const { orderData, setOrderData } = useOrder();
    const [animateCheck, setAnimateCheck] = useState(false);

    const { fetchCart } = useContext(CartLength);

    const navigate = useNavigate();

    useEffect(() => {
        const validateAndCreateOrder = async () => {
            const params = new URLSearchParams(window.location.search);
            const paymentId = params.get("payment_id");
            const orderId = params.get("order_id");
            const signature = params.get("signature");

            if (!paymentId || !orderId || !signature) {
                setStatus("error");
                return;
            }

            try {
                const validateRes = await fetch(
                    `${API_URL}/api/payments/validate`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ paymentId, orderId, signature }),
                        credentials: "include",
                    }
                );

                const validation = await validateRes.json();

                if (!validation.valid) {
                    setStatus("error");
                    return;
                }
                if (!validation.exists) {
                    const orderRes = await fetch(`${API_URL}/api/orders`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...orderData,
                            paymentId,
                            payment: {
                                paymentOrderId: orderId,
                                signature,
                                status: "paid",
                            },
                        }),
                        credentials: "include",
                    });

                    if (!orderRes.ok) {
                        setStatus("error");
                        return;
                    }

                    const orderData2 = await orderRes.json();
                    setOrderDetails(orderData2);
                    fetchCart()
                }

                setStatus("success");
                setAnimateCheck(true);
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        };

        validateAndCreateOrder();
    }, []);

    const CheckAnimation = () => (
        <div className="flex items-center justify-center mb-6">
            <div
                className={`relative transition-all duration-1000 ${
                    animateCheck ? "scale-100" : "scale-0"
                }`}
            >
                <div className="rounded-full bg-green-100 p-6">
                    <div
                        className={`transition-all duration-700 ${
                            animateCheck ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <Check
                            className="h-16 w-16 text-green-600"
                            strokeWidth={3}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                {status === "loading" && (
                    <>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl font-semibold">
                                Processing Your Order
                            </CardTitle>
                            <CardDescription>
                                Please wait while we confirm your payment
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="animate-spin my-6">
                                <RefreshCw className="h-12 w-12 text-blue-500" />
                            </div>
                        </CardContent>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold text-green-600">
                                Order Successful!
                            </CardTitle>
                            <CardDescription>
                                Your order has been placed and confirmed
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CheckAnimation />

                            <Alert className="bg-green-50 border-green-200">
                                <Receipt className="h-4 w-4 text-green-600" />
                                <AlertTitle>Order Receipt</AlertTitle>
                                <AlertDescription>
                                    {orderDetails?.receipt ? (
                                        <span className="font-medium">
                                            {orderDetails.receipt}
                                        </span>
                                    ) : (
                                        "Your receipt will be emailed shortly"
                                    )}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                        <CardFooter className="flex justify-center gap-4 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/account?tab=orders")}
                            >
                                View Orders
                            </Button>
                            <Button onClick={() => navigate("/")}>
                                Continue Shopping
                            </Button>
                        </CardFooter>
                    </>
                )}

                {status === "error" && (
                    <>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl font-semibold text-red-600">
                                Payment Verification Failed
                            </CardTitle>
                            <CardDescription>
                                We couldn't process your order
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="my-6 text-red-500">
                                <AlertCircle className="h-12 w-12" />
                            </div>
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    There was a problem validating your payment.
                                    Please try again or contact customer
                                    support.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                        <CardFooter className="flex justify-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/cart")}
                            >
                                Return to Cart
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => navigate("/contact")}
                            >
                                Contact Support
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
};

export default SuccessPage;

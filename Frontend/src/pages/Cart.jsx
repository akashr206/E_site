import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import EmptyCart from "../components/EmptyCart";
import { useAuth } from "../Contexts/AuthContext";
import { API_URL } from "../config/api";
import ShippingAddressSelector from "../components/ShippingAddressSelector";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import logo from "../assets/logo2.png";
import { useOrder } from "../Contexts/orderDataContext";
import { Skeleton } from "../components/ui/skeleton";
import clsx from "clsx";
import { Trash2, X } from "lucide-react";

const NonCart = () => {
    return (
        <div className="flex items-center justify-center absolute w-full -z-10 top-0 h-screen px-4">
            <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <LockClosedIcon className="w-12 h-12 text-pink-500 mx-auto mb-4" />

                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Your Cart is Locked
                </h1>
                <p className="text-gray-500 mb-6">
                    Login to unlock your cart and start adding your favorite
                    items!
                </p>

                <Button
                    onClick={() =>
                        (window.location.href = `${API_URL}/auth/google`)
                    }
                >
                    <span>Login Now</span>
                </Button>
            </div>
        </div>
    );
};

const CartItem = (product) => {
    const [stock, setStock] = useState(3);
    useEffect(() => {
        async function fetchStock() {
            let response = await fetch(
                `${API_URL}/api/products/stock/${product.productId}?color=${product.color}&size=${product.size}`
            );
            let data = await response.json();
            if (data.stock < 3) {
                setStock(data.stock);
            }
        }
        fetchStock();
    }, []);

    return (
        <div
            className={clsx(
                "flex items-start bg-white p-3 rounded-lg shadow",
                product.className
            )}
        >
            <Link
                className="w-24 h-24 flex justify-center items-center"
                to={`/products/${product.productId}`}
            >
                <img
                    src={product.image}
                    className="h-full rounded-md object-contain"
                />
            </Link>
            <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-500">
                    {product.color} &bull; {product.size}
                </p>
                <div className="flex gap-2 mt-2 items-end">
                    <p className=" text-gray-700 font-medium">
                        ₹{product.price}.00
                    </p>
                    <p className="text-sm text-muted-foreground line-through">
                        ₹{product.mrp}.00
                    </p>
                    <p className="text-sm font-medium text-green-600">
                        {Math.round((1 - product.price / product.mrp) * 100)}%
                        off
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end space-x-2">
                <button
                    onClick={() => product.OnRemove(product.id)}
                    className="text-gray-400 flex p-2 hover:text-red-500"
                >
                    <span>&#10006;</span>
                </button>
                <Menu as="div" className="relative inline-block text-left m-4">
                    <div>
                        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            {product.quantity}
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="-mr-1 size-5 text-gray-400"
                            />
                        </MenuButton>
                    </div>

                    <MenuItems
                        transition
                        className="absolute right-0 mt-1 z-10 w-[52px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                        <div className="py-1 ">
                            {Array.from({ length: stock }, (_, index) => (
                                <MenuItem key={index}>
                                    <a
                                        onClick={() =>
                                            product.onUpdate(
                                                product.id,
                                                index + 1
                                            )
                                        }
                                        className="block z-10 cursor-pointer px-4 py-1  text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                    >
                                        {index + 1}
                                    </a>
                                </MenuItem>
                            ))}
                        </div>
                    </MenuItems>
                </Menu>
            </div>
        </div>
    );
};

export default function Cart() {
    const [products, setProducts] = useState([]);
    const [outOfStock, setOutOfStock] = useState([]);
    const [total, setTotal] = useState(0);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const { user, loadingUser } = useAuth();
    const [subTotal, setSubTotal] = useState(0);
    const tax = 10;
    const shippingCost = 100;
    const discount = 50;
    const { setOrderData } = useOrder();
    const navigate = useNavigate();

    async function fetchCart() {
        const response = await fetch(`${API_URL}/api/cart/user`, {
            credentials: "include",
        });
        const products = await response.json();
        console.log(products);

        if (products.length === 0) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
        setProducts(products.filter((product) => product.inStock));
        setOutOfStock(products.filter((product) => !product.inStock));
    }

    async function removeItem(id) {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/cart/remove/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        await fetchCart();
        setIsLoading(false);
    }

    async function updateQuantity(id, quantity) {
        const response = await fetch(`${API_URL}/api/cart/update/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity, cartItemId: id }),
            credentials: "include",
        });
        const data = await response.json();
        fetchCart();
        fetchTotal();
        return data;
    }

    async function fetchTotal() {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/cart/total`, {
            credentials: "include",
        });
        const data = await response.json();
        setSubTotal(data.mrp);

        setTotal(data.totalPrice + shippingCost);
        setIsLoading(false);
    }

    async function handlePaymentSuccess(response) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

        navigate(
            `/checkout/success?payment_id=${razorpay_payment_id}&order_id=${razorpay_order_id}&signature=${razorpay_signature}`
        );
    }

    function handlePaymentFailure(response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    }

    async function openPaymentGateway(amount, order_id, e) {
        var options = {
            key: "rzp_test_KmfRUU7XEGMhMz",
            amount,
            currency: "INR",
            name: "Mahira",
            description: "Test Transaction",
            image: logo,
            order_id,
            handler: handlePaymentSuccess,
            prefill: {
                name: user.name,
                email: user.email,
                contact: "",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#ec4899",
            },
        };
        var rzp1 = new Razorpay(options);
        rzp1.on("payment.failed", handlePaymentFailure);
        rzp1.open();
        e.preventDefault();
    }

    async function handleCheckout(e) {
        if (!selectedAddress) {
            toast.warning("Please select a shipping address before checkout");
            return;
        }

        try {
            const orderPayload = {
                addressId: selectedAddress._id,
                items: products.map((p) => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    price: p.price,
                    productName: p.name,
                    variant: {
                        color: p.color,
                        size: p.size,
                    },
                })),
                summary: {
                    tax,
                    discount,
                    shippingCost,
                    totalAmount: total,
                    subTotal,
                },
            };
            localStorage.setItem("order", JSON.stringify(orderPayload));
            setOrderData(orderPayload);
            const orderResponse = await fetch(
                `${API_URL}/api/payments/order/create`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: total * 100,
                        receipt: nanoid(10),
                    }),
                    credentials: "include",
                }
            );
            const paymentOrder = await orderResponse.json();

            await openPaymentGateway(paymentOrder.amount, paymentOrder.id, e);
        } catch (error) {
            console.error("Checkout error:", error);
            alert("There was an error processing your checkout");
        }
    }

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
    };

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                await Promise.all([fetchCart(), fetchTotal()]);
            } catch (error) {
                console.error("Error loading cart data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);
    if (!user && !loadingUser) return <NonCart />;
    if (isEmpty) return <EmptyCart />;

    return (
        <>
            <div className="max-w-7xl lg:pb-12 relative px-3 py-5 lg:px-8 mx-auto">
                <div>
                    <h1 className="text-2xl font-norm mb-5">Shopping Cart</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {isLoading || loadingUser ? (
                                <div className="flex h-[120px] items-start bg-white p-3 rounded-lg shadow">
                                    <Link
                                        className="w-24 h-24 flex justify-center items-center"
                                        to={`/products/`}
                                    >
                                        <Skeleton className="h-24 w-24 rounded-md object-contain" />
                                    </Link>
                                    <div className="ml-4 flex-1 flex justify-around h-full flex-col ">
                                        <Skeleton className="h-5 w-36"></Skeleton>
                                        <Skeleton className="h-3 w-24"></Skeleton>
                                        <Skeleton className="h-4 w-16"></Skeleton>
                                    </div>
                                    <div className="flex flex-col h-20 justify-between items-center space-x-2">
                                        <button className="text-gray-400 flex justify-end w-full hover:text-red-500">
                                            <span>&#10006;</span>
                                        </button>
                                        <Skeleton className="h-8 w-12"></Skeleton>
                                    </div>
                                </div>
                            ) : (
                                products.map((product) => {
                                    return (
                                        <CartItem
                                            onUpdate={(id, quantity) =>
                                                updateQuantity(id, quantity)
                                            }
                                            OnRemove={removeItem}
                                            id={product._id}
                                            productId={product.productId}
                                            key={product._id}
                                            name={product.name}
                                            image={
                                                product.images
                                                    ? product?.images[0]
                                                    : ""
                                            }
                                            color={product.color}
                                            quantity={product.quantity}
                                            size={product.size}
                                            price={product.price}
                                            mrp={product.mrp}
                                        />
                                    );
                                })
                            )}
                            {outOfStock.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <div className=" text-destructive">
                                            <p className="font-semibold">
                                                Out of Stock
                                            </p>
                                            <p className="text-sm text-red-400">
                                                Unfortunately{" "}
                                                {outOfStock.length}{" "}
                                                {outOfStock.length > 1
                                                    ? "products are "
                                                    : "product is "}
                                                out of stock in your cart.
                                            </p>
                                        </div>
                                        <Button variant={"ghost"} className="p-3">
                                            <Trash2 className="text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {outOfStock.map((product) => {
                                            if (!product.inStock)
                                                return (
                                                    <div className="relative">
                                                        <CartItem
                                                            className="pointer-events-none"
                                                            onUpdate={(
                                                                id,
                                                                quantity
                                                            ) =>
                                                                updateQuantity(
                                                                    id,
                                                                    quantity
                                                                )
                                                            }
                                                            OnRemove={
                                                                removeItem
                                                            }
                                                            id={product._id}
                                                            productId={
                                                                product.productId
                                                            }
                                                            key={product._id}
                                                            name={product.name}
                                                            image={
                                                                product.images
                                                                    ?.length > 0
                                                                    ? product
                                                                          ?.images[0]
                                                                    : ""
                                                            }
                                                            color={
                                                                product.color
                                                            }
                                                            quantity={
                                                                product.quantity
                                                            }
                                                            size={product.size}
                                                            price={
                                                                product.price
                                                            }
                                                            mrp={product.mrp}
                                                        />
                                                        <div className="absolute inset-0  pointer-events-none opacity-60  bg-muted"></div>
                                                    </div>
                                                );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:sticky lg:self-start top-20">
                            <ShippingAddressSelector
                                onAddressSelect={handleAddressSelect}
                            />
                            <div className="p-6 h-max rounded-lg shadow">
                                <h2 className="text-lg font-semibold mb-4">
                                    Order summary
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium">
                                            ₹{subTotal}.00
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-medium">
                                            ₹{shippingCost}.00
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span className="font-medium text-green-500">
                                            -₹{subTotal - total + shippingCost}
                                            .00
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        All the prices are inclusive of tax
                                    </p>
                                </div>

                                {selectedAddress && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h3 className="font-semibold text-sm mb-2">
                                            Shipping to:
                                        </h3>
                                        <p className="text-sm">
                                            {selectedAddress.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {selectedAddress.street}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {selectedAddress.city},{" "}
                                            {selectedAddress.state}{" "}
                                            {selectedAddress.postalCode}
                                        </p>
                                    </div>
                                )}

                                <div className="border-t mt-4 pt-4">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Order total</span>
                                        <span>₹{total}.00</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full mt-6"
                                    disabled={!selectedAddress}
                                >
                                    {selectedAddress
                                        ? "Checkout"
                                        : "Select an address to continue"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

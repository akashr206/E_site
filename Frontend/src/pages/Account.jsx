import { useEffect, useState } from "react";
import orderImg from "../assets/order.svg";
import accountImg from "../assets/accBlue.svg";
import pinImg from "../assets/pin.svg";
import Info from "@/components/Account/Info";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import OrdersPreview from "../components/Account/OrderPreview";
import OrderDetails from "../components/Account/OrderDetails";
import ManageAddresses from "../components/Account/ManageAddresses";
import { useSearchParams } from "react-router-dom";
import AddressForm from "../components/Account/AddressForm";
import AddressUpdate from "../components/Account/AddressUpdate";
import { ShoppingBag, User, MapPin } from "lucide-react";

const Account = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, loadingUser, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState(
        searchParams.get("tab") ? searchParams.get("tab") : "info"
    );

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (!loadingUser && !user) {
            setUser(null);
        }
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkDevice();
        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
    }, [loadingUser, user, navigate]);

    useEffect(() => {
        setActiveTab(searchParams.get("tab") || "info");
    }, [searchParams.get("tab")]);

    const renderTabContent = () => {
        switch (activeTab) {
            case "info":
                return user ? <Info user={user} isMobile={isMobile} /> : null;
            case "orders":
                return <OrdersPreview />;
            case "details":
                return <OrderDetails />;
            case "addresses":
                return <ManageAddresses />;
            case "add":
                return <AddressForm />;
            case "edit":
                return <AddressUpdate />;
            default:
                return null;
        }
    };

    if (loadingUser) return <Loading />;

    if (isMobile)
        return (
            <div className="flex min-h-screen  max-w-5xl mx-auto bg-border/15">
                <div className="w-max hidden  flex-col gap-3 p-3">
                    <img
                        src={
                            user
                                ? `${user.image}`
                                : "https://tse2.mm.bing.net/th?id=OIP.x7X2oAehk5M9IvGwO_K0PgHaHa&pid=Api&P=0&h=180"
                        }
                        alt="User"
                        className="w-12 h-12 rounded-full"
                    />

                    <ul className="text-center w-max gap-3 py-2 flex flex-col rounded-sm">
                        <li
                            className={`font-semibold  rounded-full px-3 flex gap-2 items-center py-3 cursor-pointer ${
                                activeTab === "info"
                                    ? "text-pink-500 bg-pink-100"
                                    : "opacity-75"
                            }`}
                            onClick={() => searchParams.set("tab", "info")}
                        >
                            <img src={accountImg} alt="Profile Information" />
                        </li>
                        <li
                            className={`font-semibold  px-3 rounded-full flex gap-2 items-center py-3 cursor-pointer ${
                                activeTab === "orders"
                                    ? "text-pink-500 bg-pink-100 opacity-100"
                                    : "opacity-75"
                            }`}
                            onClick={() => {
                                searchParams.set("tab", "orders");
                                setSearchParams(searchParams);
                            }}
                        >
                            <ShoppingBag></ShoppingBag>
                        </li>
                        <li
                            className={`font-semibold  px-3 rounded-full flex gap-2 items-center py-3 cursor-pointer ${
                                activeTab === "addresses" ||
                                activeTab === "add" ||
                                activeTab === "edit"
                                    ? "text-pink-500 bg-pink-100 opacity-100"
                                    : "opacity-75"
                            }`}
                            onClick={() => {
                                searchParams.set("tab", "addresses");
                                setSearchParams(searchParams);
                            }}
                        >
                            <MapPin></MapPin>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 bg-white">{renderTabContent()}</div>
            </div>
        );

    return (
        <div className="flex min-h-screen max-w-5xl mx-auto bg-border">
            <div className="w-1/3 bg-white flex flex-col gap-5 p-5">
                <div className="text-center rounded-sm min-w-[192px] shadow px-4 py-2 flex items-center">
                    <img
                        src={
                            user
                                ? `${user.image}`
                                : "https://tse2.mm.bing.net/th?id=OIP.x7X2oAehk5M9IvGwO_K0PgHaHa&pid=Api&P=0&h=180"
                        }
                        alt="User"
                        className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col ml-3 items-start">
                        <p className="text-sm">Hello</p>
                        <p className="text-md font-semibold">
                            {user ? `${user.name}` : ""}
                        </p>
                    </div>
                </div>

                <ul className="text-center min-w-[192px] shadow py-2 flex flex-col rounded-sm">
                    <li
                        className={`font-semibold px-4 flex gap-2 items-center py-3 cursor-pointer ${
                            activeTab === "info"
                                ? "text-pink-500 bg-pink-100"
                                : ""
                        }`}
                        onClick={() => {
                            searchParams.set("tab", "info");
                            setSearchParams(searchParams);
                        }}
                    >
                        <User size={18}></User>
                        Profile Information
                    </li>
                    <li
                        className={`font-semibold px-4 flex gap-2 py-3 cursor-pointer items-center ${
                            activeTab === "orders" || activeTab === "details"
                                ? "text-pink-500 bg-pink-100"
                                : ""
                        }`}
                        onClick={() => {
                            searchParams.set("tab", "orders");
                            setSearchParams(searchParams);
                        }}
                    >
                        <ShoppingBag size={18}></ShoppingBag>
                        My Orders
                    </li>
                    <li
                        className={`font-semibold  px-4 flex gap-2 items-center py-3 cursor-pointer ${
                            activeTab === "addresses" ||
                            activeTab === "add" ||
                            activeTab === "edit"
                                ? "text-pink-500 bg-pink-100"
                                : ""
                        }`}
                        onClick={() => {
                            searchParams.set("tab", "addresses");
                            setSearchParams(searchParams);
                        }}
                    >
                        <MapPin size={18}></MapPin>
                        Manage Addresses
                    </li>
                </ul>
            </div>

            <div className="flex-1 bg-white p-5">{renderTabContent()}</div>
        </div>
    );
};

export default Account;

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
    return (
        <div className="flex min-h-screen max-w-5xl mx-auto bg-border">
            <div className="md:w-1/3 max-md:fixed w-full max-md:h-16 top-16 left-0 bg-white flex md:flex-col md:gap-5 md:p-5">
                <div className="text-center max-md:hidden rounded-sm md:shadow px-4 py-2 flex items-center">
                    <img
                        src={
                            user
                                ? `${user.image}`
                                : "https://tse2.mm.bing.net/th?id=OIP.x7X2oAehk5M9IvGwO_K0PgHaHa&pid=Api&P=0&h=180"
                        }
                        alt="User"
                        className="w-12 h-12 aspect-square rounded-full"
                    />
                    <div className="flex flex-col ml-3 items-start">
                        <p className="text-sm">Hello</p>
                        <p className="text-md font-semibold">
                            {user ? `${user.name}` : ""}
                        </p>
                    </div>
                </div>

                <ul className="text-center max-md:w-full md:shadow py-2 flex md:flex-col rounded-sm">
                    <li
                        className={`font-semibold px-4 max-md:justify-center flex-1 flex gap-2 items-center py-3 cursor-pointer ${
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
                        <p className="max-md:hidden">Profile Information</p>
                    </li>
                    <li
                        className={`font-semibold px-4 flex-1 max-md:justify-center flex gap-2 py-3 cursor-pointer items-center ${
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
                        <p className="max-md:hidden">My Orders</p>
                    </li>
                    <li
                        className={`font-semibold flex-1 max-md:justify-center px-4 flex gap-2 items-center py-3 cursor-pointer ${
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
                        <p className="max-md:hidden">Manage Addresses</p>
                    </li>
                </ul>
            </div>

            <div className="md:flex-1 w-full max-md:mt-16 bg-white p-5">{renderTabContent()}</div>
        </div>
    );
};

export default Account;

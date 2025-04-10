import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { Skeleton } from "./ui/skeleton";
import { Home, BriefcaseBusiness } from "lucide-react";
export default function ShippingAddressSelector({ onAddressSelect, onRender }) {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAddresses() {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/address`, {
                    credentials: "include",
                });
                const data = await response.json();
                console.log(data);

                setAddresses(data);
                if (data.length > 0) {
                    setSelectedAddressId(data[0]._id);
                    onAddressSelect(data[0]);
                }
            } catch (error) {
                console.error("Error loading addresses:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAddresses();
    }, []);

    const handleAddressSelect = (addressId) => {
        setSelectedAddressId(addressId);
        const selectedAddress = addresses.find(
            (addr) => addr._id === addressId
        );
        if (selectedAddress) {
            onAddressSelect(selectedAddress);
        }
    };

    const goToAddressPage = () => {
        navigate("/account?tab=addresses");
    };

    if (isLoading)
        return (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-20" />
                    <Skeleton className="w-full h-20" />
                </div>
            </div>
        );

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>

            {addresses.length > 0 ? (
                <div className="space-y-3">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className={`border rounded-md p-3 cursor-pointer transition ${
                                selectedAddressId === address._id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleAddressSelect(address._id)}
                        >
                            <div className="flex items-start">
                                <input
                                    type="radio"
                                    className="mt-1 mr-3"
                                    checked={selectedAddressId === address._id}
                                    onChange={() =>
                                        handleAddressSelect(address._id)
                                    }
                                />
                                <div>
                                    <p className="font-medium flex items-center gap-2">
                                        <span className="">
                                            {address.tag === "Home" ? (
                                                <Home size={18} />
                                            ) : address.tag === "Work" ? (
                                                <BriefcaseBusiness size={18} />
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                        {address.tag}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {address.street}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {address.city}, {address.state}{" "}
                                        {address.postalCode}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {address.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="mt-3">
                        <Button onClick={goToAddressPage} className="text-sm">
                            Manage Addresses
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">
                        No saved addresses found. Please add an address to
                        continue.
                    </p>
                    <Button onClick={goToAddressPage}>Add Address</Button>
                </div>
            )}
        </div>
    );
}

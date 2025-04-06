import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    BriefcaseBusiness,
    Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { useSearchParams } from "react-router-dom";
import AddressDelete from "./AddressDelete";

const ManageAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchAddresses();
    }, []);

    async function fetchAddresses() {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/address`, {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch addresses");
            }

            const data = await res.json();
            setAddresses(data);
        } catch (error) {
            toast.error("Failed to load addresses", {
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    }

    async function deleteAddress(id) {
        try {
            const res = await fetch(`${API_URL}/api/address/`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error("Failed to delete address");
            }

            toast.success("Address deleted successfully");
            fetchAddresses();
        } catch (error) {
            toast.error("Failed to delete address", {
                description: error.message,
            });
        }
    }

    function handleEdit(id) {
        navigate(`?tab=edit&id=${id}`);
    }

    function handleAddNew() {
        searchParams.set("tab", "add");
        setSearchParams(searchParams);
    }

    return (
        <Card className="rounded-none max-sm:shadow-none max-sm:border-none">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Addresses</CardTitle>
                <Button
                    onClick={handleAddNew}
                    className="flex items-center max-sm:text-[12px] gap-2 bg-indigo-500 hover:bg-indigo-600"
                >
                    <PlusIcon size={16} />
                    Add New Address
                </Button>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="text-center flex gap-4 py-8">
                        <Skeleton className="w-1/2 h-[184px]"></Skeleton>
                        <Skeleton className="w-1/2 h-[184px]"></Skeleton>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        You don't have any saved addresses yet.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                            <Card key={address._id} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="">
                                                {address.tag === "Home" ? (
                                                    <Home size={18} />
                                                ) : address.tag === "Work" ? (
                                                    <BriefcaseBusiness
                                                        size={18}
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                            </span>
                                            <h3 className="font-medium ">
                                                {address.tag}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleEdit(address._id)
                                                }
                                            >
                                                <PencilIcon size={16} />
                                            </Button>
                                            <AddressDelete
                                                onDelete={() =>
                                                    deleteAddress(address._id)
                                                }
                                            ></AddressDelete>
                                        </div>
                                    </div>
                                    <p className="mb-1">{address.street}</p>
                                    <p className="mb-1">
                                        {address.city}, {address.state}{" "}
                                        {address.postalCode}
                                    </p>
                                    <p className="mb-1">{address.country}</p>
                                    {address.landmark && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Landmark: {address.landmark}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ManageAddresses;

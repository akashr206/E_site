import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { API_URL } from "../../config/api";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddressUpdate = () => {
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        landmark: "",
        tag: "",
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const fetchAddress = async () => {
        let res = await fetch(`${API_URL}/api/address`, {
            credentials: "include",
        });
        let data = await res.json();
        data = data.find((e) => e._id === searchParams.get("id"));
        
        setAddress(data);
    };

    const handleSelectChange = (name, value) => {
        setAddress((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ["street", "city", "state", "postalCode"];
        requiredFields.forEach((field) => {
            if (!address[field]?.trim()) {
                newErrors[field] = "This field is required";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const res = await fetch(`${API_URL}/api/address`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    update: address,
                    id: searchParams.get("id"),
                }),
            });
            if (res.ok) {
                toast.success("Address updated", {
                    description: "Your address has been updated successfully.",
                });
                navigate(-1)
            } else {
                try {
                    const data = await res.json();
                    toast.error("Failed to update address", {
                        description: data.message || "Unknown error",
                    });
                } catch {
                    toast.error("Failed to update address", {
                        description: "Server error occurred",
                    });
                }
            }
        } else {
            toast.error("Validation error", {
                description: "Please fill all required fields",
            });
        }
    };

    useEffect(() => {
        fetchAddress();
    }, []);

    return (
        <Card className="w-full rounded-none relative border-none p-0 mx-auto">
            <CardHeader>
                <CardTitle className="flex justify-center items-center  h-10">
                    <Button
                        onClick={() => navigate(-1)}
                        className="flex m-2 items-center gap-1 left-0 absolute top-0"
                        variant="ghost"
                    >
                        <ChevronLeft className="mb-[1px]" />
                        <p className="max-sm:hidd en">Back</p>
                    </Button>
                    Update Address
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="street">Street Address *</Label>
                        <Input
                            id="street"
                            name="street"
                            value={address.street}
                            onChange={handleChange}
                            className={
                                errors.street
                                    ? "ring-1 ring-red-500 focus-visible:ring-pink-500"
                                    : "focus-visible:ring-pink-500"
                            }
                        />
                        {errors.street && (
                            <p className="text-sm text-red-500">
                                {errors.street}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                name="city"
                                value={address.city}
                                onChange={handleChange}
                                className={
                                    errors.city
                                        ? "ring-1 ring-red-500 focus-visible:ring-pink-500"
                                        : "focus-visible:ring-pink-500"
                                }
                            />
                            {errors.city && (
                                <p className="text-sm text-red-500">
                                    {errors.city}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input
                                id="state"
                                name="state"
                                value={address.state}
                                onChange={handleChange}
                                className={
                                    errors.state
                                        ? "ring-1 ring-red-500 focus-visible:ring-pink-500"
                                        : "focus-visible:ring-pink-500"
                                }
                            />
                            {errors.state && (
                                <p className="text-sm text-red-500">
                                    {errors.state}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code *</Label>
                            <Input
                                id="postalCode"
                                name="postalCode"
                                value={address.postalCode}
                                onChange={handleChange}
                                className={
                                    errors.postalCode
                                        ? "ring-1 ring-red-500 focus-visible:ring-pink-500"
                                        : "focus-visible:ring-pink-500"
                                }
                            />
                            {errors.postalCode && (
                                <p className="text-sm text-red-500">
                                    {errors.postalCode}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                value={address.country}
                                placeholder="India"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                            id="landmark"
                            name="landmark"
                            value={address.landmark}
                            onChange={handleChange}
                            className="focus-visible:ring-pink-500"
                            placeholder="Optional"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tag">Tag</Label>
                        <Select
                            value={address.tag}
                            onValueChange={(value) =>
                                handleSelectChange("tag", value)
                            }
                        >
                            <SelectTrigger className="focus:ring-pink-500 focus:ring-1">
                                <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Home">Home</SelectItem>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-pink-500 hover:bg-pink-600"
                        >
                            Update Address
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddressUpdate;

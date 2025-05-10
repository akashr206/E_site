import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { LogOut, User, Mail, Edit, Shield } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Info = ({ user }) => {
    const { logout } = useAuth();
    
    const handleLogout = () => {
        logout();
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(part => part[0]).join("").toUpperCase();
    };

    const nameParts = user?.name?.split(" ") || ["", ""];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {getInitials(user?.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-medium">{user?.name}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
            </div>

            <Separator />
            <div>
                <h2 className="text-lg font-medium mb-4 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                            <Input
                                id="firstName"
                                value={firstName}
                                className="pr-10"
                                readOnly
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="relative">
                            <Input
                                id="lastName"
                                value={lastName}
                                className="pr-10"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-medium mb-4 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Information
                </h2>
                
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            value={user?.email}
                            className="pr-10"
                            readOnly
                        />
                        <div className="absolute right-3 top-2 px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-500">
                            Verified
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default Info;
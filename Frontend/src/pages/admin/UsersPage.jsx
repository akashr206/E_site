import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    Lock,
    MoreHorizontal,
    Plus,
    Search,
    ShieldCheck,
    ShoppingBag,
    User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const users = [
    {
        uId: "USR-001",
        name: "John Doe",
        image: "/placeholder-user.jpg",
        email: "john.doe@example.com",
        isAdmin: false,
        orders: 5,
        addresses: 2,
        lastActive: new Date("2023-04-10"),
    },
    {
        uId: "USR-002",
        name: "Jane Smith",
        image: "/placeholder-user.jpg",
        email: "jane.smith@example.com",
        isAdmin: false,
        orders: 3,
        addresses: 1,
        lastActive: new Date("2023-04-09"),
    },
    {
        uId: "USR-003",
        name: "Robert Johnson",
        image: "/placeholder-user.jpg",
        email: "robert.johnson@example.com",
        isAdmin: false,
        orders: 2,
        addresses: 1,
        lastActive: new Date("2023-04-08"),
    },
    {
        uId: "USR-004",
        name: "Emily Davis",
        image: "/placeholder-user.jpg",
        email: "emily.davis@example.com",
        isAdmin: false,
        orders: 1,
        addresses: 1,
        lastActive: new Date("2023-04-07"),
    },
    {
        uId: "USR-005",
        name: "Michael Wilson",
        image: "/placeholder-user.jpg",
        email: "michael.wilson@example.com",
        isAdmin: false,
        orders: 4,
        addresses: 2,
        lastActive: new Date("2023-04-06"),
    },
    {
        uId: "ADM-001",
        name: "Admin User",
        image: "/placeholder-user.jpg",
        email: "admin@example.com",
        isAdmin: true,
        orders: 0,
        addresses: 1,
        lastActive: new Date("2023-04-10"),
    },
];

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.uId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === "all" ||
            (roleFilter === "admin" && user.isAdmin) ||
            (roleFilter === "customer" && !user.isAdmin);

        return matchesSearch && matchesRole;
    });

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsDetailsOpen(true);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <p className="text-muted-foreground">
                    Manage user accounts, view customer information, and assign
                    admin privileges.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="customer">
                                    Customer
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-1">
                                <Plus className="h-4 w-4" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                                <DialogDescription>
                                    Create a new user account with the following
                                    details.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email address"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="admin" />
                                    <Label htmlFor="admin">
                                        Admin Privileges
                                    </Label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Add User</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.uId}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={user.image}
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback>
                                                        {user.name.charAt(0)}
                                                        {user.name
                                                            .split(" ")[1]
                                                            ?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.uId}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.isAdmin ? (
                                                <Badge className="bg-purple-500">
                                                    Admin
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    Customer
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{user.orders}</TableCell>
                                        <TableCell>
                                            {formatDate(user.lastActive)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        Reset Password
                                                    </DropdownMenuItem>
                                                    {!user.isAdmin && (
                                                        <DropdownMenuItem>
                                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                                            Make Admin
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button variant="outline" size="sm">
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {selectedUser?.name && (
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>
                                Detailed information about {selectedUser.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center gap-2">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src={selectedUser.image}
                                        alt={selectedUser.name}
                                    />
                                    <AvatarFallback className="text-xl">
                                        {selectedUser.name.charAt(0)}
                                        {selectedUser.name
                                            .split(" ")[1]
                                            ?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-medium">
                                    {selectedUser.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedUser.email}
                                </p>
                                {selectedUser.isAdmin ? (
                                    <Badge className="bg-purple-500">
                                        Admin
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Customer</Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        User ID
                                    </span>
                                    <span className="text-sm">
                                        {selectedUser.uId}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        Orders
                                    </span>
                                    <span className="text-sm">
                                        {selectedUser.orders}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">
                                    Account Information
                                </h4>
                                <div className="rounded-md border p-3 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Last Active
                                        </span>
                                        <span className="text-sm">
                                            {formatDate(
                                                selectedUser.lastActive
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Addresses
                                        </span>
                                        <span className="text-sm">
                                            {selectedUser.addresses}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <DialogClose
                                variant="outline"
                                className="sm:flex-1"
                                onClick={() => {
                                    setIsDetailsOpen(false);
                                    setSelectedUser(false);
                                }}
                            >
                                Close
                            </DialogClose>
                            <Button className="sm:flex-1">Edit User</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
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
    DialogClose,
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
    Eye,
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
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import { Skeleton } from "../../components/ui/skeleton";
import { formatDate } from "../../lib/utils";
import MakeAdmin from "../../components/Admin/MakeAdmin";

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [roleFilter, setRoleFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [openAdminAlert, setOpenAdminAlert] = useState(false);
    const [adminAlertId, setAdminAlertId] = useState(null);
    const [max, setMax] = useState(1);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const page = searchParams.get("page");
    const limit = 10;

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

    const handleNext = () => {
        const page = searchParams.get("page");
        if (Number(page) + 1 <= max) {
            searchParams.set("page", Number(page) + 1);
            setSearchParams(searchParams);
        }
    };
    const handlePrev = () => {
        const page = searchParams.get("page");
        if (Number(page) - 1 > 0) {
            searchParams.set("page", Number(page) - 1);
            setSearchParams(searchParams);
        }
    };

    const handleViewDetails = (user) => {
        setActiveDropdownId(null);
        setTimeout(() => {
            setSelectedUser(user);
            setIsDetailsOpen(true);
        }, 0);
    };

    const fetchUsers = async (page = 1, limit = 10) => {
        setLoading(true);
        const res = await fetch(
            `${API_URL}/api/users/all?page=${page}&limit=${limit}`,
            {
                credentials: "include",
            }
        );
        if (res.ok) {
            const data = await res.json();
            setUsers(data.allUsers);
            setMax(data.pagination.pages);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers(page, limit);
    }, [page]);

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
                            <Button
                                disabled={true}
                                className="flex items-center gap-1"
                            >
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
                                {loading
                                    ? Array.from({ length: 10 }).map(
                                          (e, index) => {
                                              return (
                                                  <TableRow key={index}>
                                                      <TableCell>
                                                          <Skeleton className="h-3 my-2.5 w-14"></Skeleton>
                                                      </TableCell>
                                                      <TableCell>
                                                          <Skeleton className="h-3 w-16"></Skeleton>
                                                      </TableCell>
                                                      <TableCell>
                                                          <Skeleton className="h-3 w-12"></Skeleton>
                                                      </TableCell>
                                                      <TableCell>
                                                          <Skeleton className="h-3 w-12"></Skeleton>
                                                      </TableCell>
                                                      <TableCell>
                                                          <Skeleton className="h-3 w-8"></Skeleton>
                                                      </TableCell>
                                                      <TableCell>
                                                          <Skeleton className="h-3 w-8"></Skeleton>
                                                      </TableCell>
                                                      <TableCell>
                                                          <Skeleton className="h-3 w-8"></Skeleton>
                                                      </TableCell>
                                                      <TableCell className="justify-end flex">
                                                          <Skeleton className="h-3 w-8"></Skeleton>
                                                      </TableCell>
                                                  </TableRow>
                                              );
                                          }
                                      )
                                    : filteredUsers.map((user) => (
                                          <TableRow key={user.uId}>
                                              <TableCell>
                                                  <div className="flex items-center gap-3">
                                                      <Avatar>
                                                          <AvatarImage
                                                              src={user.image}
                                                              alt={user.name}
                                                          />
                                                          <AvatarFallback>
                                                              {user.name.charAt(
                                                                  0
                                                              )}
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
                                              <TableCell>
                                                  {user.email}
                                              </TableCell>
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
                                              <TableCell>
                                                  {user.orders}
                                              </TableCell>
                                              <TableCell>
                                                  {formatDate(user.lastActive)}
                                              </TableCell>
                                              <TableCell className="text-right">
                                                  <DropdownMenu
                                                      key={user.uId}
                                                      open={
                                                          activeDropdownId ===
                                                          user.uId
                                                      }
                                                      onOpenChange={(
                                                          isOpen
                                                      ) => {
                                                          setActiveDropdownId(
                                                              isOpen
                                                                  ? user.uId
                                                                  : null
                                                          );
                                                      }}
                                                  >
                                                      <DropdownMenuTrigger
                                                          asChild
                                                      >
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
                                                          <DropdownMenuSeparator />
                                                          {!user.isAdmin && (
                                                              <DropdownMenuItem
                                                                  onClick={() => {
                                                                      setActiveDropdownId(
                                                                          null
                                                                      );
                                                                      setAdminAlertId(
                                                                          user.uId
                                                                      );
                                                                      setOpenAdminAlert(
                                                                          true
                                                                      );
                                                                  }}
                                                              >
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
                    <Button
                        onClick={handlePrev}
                        disabled={page == 1}
                        variant="outline"
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={page == max}
                        variant="outline"
                        size="sm"
                    >
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
                                            Joined at
                                        </span>
                                        <span className="text-sm">
                                            {formatDate(
                                                selectedUser.createdAt
                                            )}
                                        </span>
                                    </div>
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
            <MakeAdmin
                open={openAdminAlert}
                setOpen={setOpenAdminAlert}
                id={adminAlertId}
                fetchUsers={fetchUsers}
            ></MakeAdmin>
        </div>
    );
}

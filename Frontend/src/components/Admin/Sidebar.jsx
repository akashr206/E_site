import {
    BarChart3,
    Box,
    Home,
    LogOut,
    Package,
    Settings,
    ShoppingCart,
    Users,
} from "lucide-react";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";


const AdminSidebar = ({ renderPage, setActivePage, activePage }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    return (
        <SidebarProvider>
            <nav className="fixed md:hidden z-10 bg-background border-border border flex-row-reverse flex items-center justify-between px-4 top-0 left-0 w-full h-16 ">
                <SidebarTrigger className="justify-self-start"/>
                <div className="flex items-center justify-start gap-2">
                    <img
                        src="/logo.jpg"
                        alt="logo"
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="text-lg font-bold">Admin </span>
                </div>
            </nav>

            <Sidebar collapsible={"icon"}>
                <SidebarHeader>
                    <div className="flex items-center justify-start gap-2">
                        <img
                            src="/logo.jpg"
                            alt="logo"
                            className="w-12 h-12 rounded-full"
                        />
                        <span className="text-lg font-bold">Admin </span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Main</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        isActive={activePage === "dashboard"}
                                        onClick={() => {
                                            setActivePage("dashboard");
                                            navigate("/admin/dashboard");
                                        }}
                                    >
                                        <Home className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        isActive={activePage === "products"}
                                        onClick={() => {
                                            setActivePage("products");
                                            navigate("/admin/products?page=1");
                                        }}
                                    >
                                        <Package className="h-4 w-4" />
                                        <span>Products</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        isActive={activePage === "orders"}
                                        onClick={() => {
                                            setActivePage("orders");
                                            navigate("/admin/orders?page=1");
                                        }}
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        <span>Orders</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        isActive={activePage === "users"}
                                        onClick={() => {
                                            setActivePage("users");
                                            navigate("/admin/users?page=1");
                                        }}
                                    >
                                        <Users className="h-4 w-4" />
                                        <span>Users</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Analytics</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        isActive={activePage === "analytics"}
                                        onClick={() => {
                                            setActivePage("analytics");
                                            navigate("/admin/analytics");
                                        }}
                                    >
                                        <BarChart3 className="h-4 w-4" />
                                        <span>Reports</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="border-t p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setActivePage("settings");
                                    navigate("/admin/settings");
                                }}
                            >
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Settings</span>
                            </Button>
                            <Button onClick={logout} variant="ghost" size="icon">
                                <LogOut className="h-4 w-4" />
                                <span className="sr-only">Log out</span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 rounded-full bg-primary/10">
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary">
                                    <img
                                        className="rounded-full"
                                        src={user?.image}
                                        alt="user-image"
                                    />
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {user?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="flex-1 overflow-auto p-6">
                <div className="max-md:py-16">
                   {renderPage()} 
                </div>
                
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AdminSidebar;

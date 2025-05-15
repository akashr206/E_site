import { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminUnauthorized from "./components/Admin/AdminUnauthorized";
import ProductView from "./pages/ProductView";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Search from "./pages/Search";
import Category from "./pages/Category";
import Dashboard from "./pages/admin/Dashboard";
import SuccessPage from "./pages/SuccessPage";
import Login from "./pages/Login";
import { cn } from "./lib/utils";
import { AuthProvider } from "./Contexts/AuthContext";
import { OrderProvider } from "./Contexts/orderDataContext";
import NewArrivals from "./pages/NewArrivals";
import Wishlist from "./pages/Wishlist";

function App() {
    return (
        <AuthProvider>
            <OrderProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </OrderProvider>
        </AuthProvider>
    );
}

function AppRoutes() {
    const { pathname } = useLocation();

    return (
        <>
            {!pathname.includes("admin") && <Navbar className="fixed" />}
            <main className={cn(!pathname.includes("admin") && "pt-[76px]")}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/products/:id" element={<ProductView />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/new" element={<NewArrivals />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/category/:query" element={<Category />} />
                    <Route path="/cart" element={<Cart />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/account" element={<Account />} />
                        <Route
                            path="/checkout/success"
                            element={<SuccessPage />}
                        />
                    </Route>

                    <Route
                        path="/admin"
                        element={<ProtectedRoute requiredRole="admin" />}
                    >
                        <Route path=":page" element={<Dashboard />} />
                    </Route>

                    <Route
                        path="/unauthorized"
                        element={<AdminUnauthorized redirectPath="/" />}
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </>
    );
}

export default App;

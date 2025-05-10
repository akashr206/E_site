import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import AdminUnauthorized from "./Admin/AdminUnauthorized";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ requiredRole }) {
    const { user, loadingUser } = useAuth()
    if (loadingUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin ease-in-out text-pink-500"></Loader2>
            </div>
        );
    }

    if (!user && !loadingUser) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !user.isAdmin) {
        return <AdminUnauthorized redirectPath="/" />;
    }

    return <Outlet />;
}

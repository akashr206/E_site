import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config/api";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
const AuthContext = createContext();
import { Button } from "../components/ui/button";
import { Loader } from "lucide-react";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [open, setOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const logout = () => setOpen(true);

    const logoutUser = async () => {
        setLoggingOut(true);
        const response = await fetch(
            `${import.meta.env.VITE_APIURL}/api/auth/logout`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        if (response.ok) {
            setUser(null);
            window.location.href = "/";
        } else {
            throw new Error("Logout failed");
        }
        setLoggingOut(false);
    };

    const checkAuth = async () => {
        const response = await fetch(`${API_URL}/api/auth/check`, {
            credentials: "include",
        });
        if (response.status == 200) {
            const data = await response.json();
            setUser(data);
        }

        setLoadingUser(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ logout, user, loadingUser, setUser }}>
            {children}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will log you out from your current
                            session.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpen(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            disabled={loggingOut}
                            variant={"destructive"}
                            className="w-20"
                            onClick={() => logoutUser()}
                        >
                            {loggingOut ? (
                                <Loader className="animate-spin"></Loader>
                            ) : (
                                "Logout"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

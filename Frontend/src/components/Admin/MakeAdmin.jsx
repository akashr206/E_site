import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { API_URL } from "../../config/api";
import { toast } from "sonner";
const MakeAdmin = ({ open, setOpen, id, fetchUsers }) => {
    const [loading, setLoading] = useState(false);

    async function handleMakeAdmin(id) {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/users/make-admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: id }),
            credentials: "include",
        });

        if (res.ok) {
            setOpen(false);
            toast.success("Successfully made the user as admin.");
            fetchUsers();
        } else {
            toast.error("Failed to make the user as admin");
        }
        setLoading(false);
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will make the selected user as admin.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        disabled={loading}
                        className="w-20"
                        onClick={() => handleMakeAdmin(id)}
                    >
                        {loading ? (
                            <Loader className="animate-spin"></Loader>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default MakeAdmin;

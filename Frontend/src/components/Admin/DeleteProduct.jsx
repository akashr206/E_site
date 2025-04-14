import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Trash2, Loader } from "lucide-react";
import { API_URL } from "../../config/api";
import { useState } from "react";
import { toast } from "sonner";

const DeleteProduct = ({ id, publicIds, fetchProducts }) => {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete(id, publicIds) {
        setDeleting(true);
        const res = await fetch(`${API_URL}/api/products/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicIds }),
        });

        if (res.ok) {
            setOpen(false);
            toast.success("Successfully deleted the product.");
            fetchProducts();
        } else {
            toast.error("Failed to delete product");
        }
        setDeleting(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Button variant={"ghost"} className="p-0 w-full justify-start px-2 font-normal" onClick={() => setOpen(true)}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
            </Button>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete this product.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <Button disabled={deleting} variant={"destructive"} className="w-20" onClick={() => handleDelete(id, publicIds)} >
                        {deleting? <Loader className="animate-spin"></Loader> : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteProduct;

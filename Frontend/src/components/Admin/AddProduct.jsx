import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import {
    AlertCircle,
    Plus,
    Trash,
    Upload,
    X,
    Loader2,
    Loader,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { API_URL } from "../../config/api";
import clsx from "clsx";

const CLOUDINARY_API = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD;
const PRESET = import.meta.env.VITE_PRESET;

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 1024 * 1024;

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

const variantSchema = z.object({
    color: z.string().min(1, { message: "Color is required" }),
    size: z.string().min(1, { message: "Size is required" }),
    stock: z.union([z.string(), z.number()]).refine(
        (val) => {
            const num = typeof val === "string" ? parseFloat(val) : val;
            return !isNaN(num) && num >= 0;
        },
        {
            message: "Stock must be a non-negative number",
        }
    ),
});

const productSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    price: z.union([z.string(), z.number()]).refine(
        (val) => {
            const num = typeof val === "string" ? parseFloat(val) : val;
            return !isNaN(num) && num > 0;
        },
        {
            message: "Price must be a positive number",
        }
    ),
    mrp: z
        .union([z.string().min(1, { message: "MRP is required" }), z.number()])
        .refine(
            (val) => {
                const num = typeof val === "string" ? parseFloat(val) : val;
                return !isNaN(num) && num > 0;
            },
            {
                message: "MRP must be a positive number",
            }
        ),
    material: z.string().min(1, { message: "Material is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    categories: z
        .array(z.string())
        .min(1, { message: "Select at least one category" }),
    tags: z.array(z.string()).optional(),
    variants: z
        .array(variantSchema)
        .min(1, { message: "Add at least one variant" }),
});

const AddProduct = ({
    getUniqueCategories,
    tab,
    fetchProducts,
    EditOpen,
    setEditOpen,
}) => {
    const [open, setOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [customCategory, setCustomCategory] = useState("");
    const [customCategories, setCustomCategories] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [tags, setTags] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [imageError, setImageError] = useState("");
    const [variants, setVariants] = useState([
        { color: "", size: "", stock: "" },
    ]);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [variantErrors, setVariantErrors] = useState([]);
    const fileInputRef = useRef(null);
    const contentRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            id: "",
            price: "",
            mrp: "",
            material: "",
            description: "",
            categories: [],
            tags: [],
            variants: [],
        },
    });

    useEffect(() => {
        setValue("variants", variants);
    }, [variants, setValue]);

    useEffect(() => {
        setValue("categories", selectedCategories);
    }, [selectedCategories, setValue]);

    useEffect(() => {
        setValue("tags", tags);
    }, [tags, setValue]);

    const handleImageUpload = (files) => {
        if (imageFiles.length + files.length > MAX_IMAGES) {
            setImageError(
                `You can upload a maximum of ${MAX_IMAGES} images. ${
                    MAX_IMAGES - imageFiles.length
                } slots remaining.`
            );

            const remainingSlots = MAX_IMAGES - imageFiles.length;
            if (remainingSlots <= 0) return;

            files = Array.from(files).slice(0, remainingSlots);
        } else {
            setImageError("");
        }

        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];

        let sizeError = false;

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                sizeError = true;
                return;
            }

            newFiles.push(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target.result);
                setImagePreviews([...newPreviews]);
            };
            reader.readAsDataURL(file);
        });

        if (sizeError) {
            setImageError(
                `File size exceeds the limit of 1MB. Please upload smaller images.`
            );
        }

        setImageFiles(newFiles);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleImageUpload(e.target.files);
        }
    };

    const removeImage = (index) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];

        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setImageFiles(newFiles);
        setImagePreviews(newPreviews);

        if (newFiles.length < MAX_IMAGES) {
            setImageError("");
        }
    };

    const handleCategoryChange = (category, checked) => {
        let newCategories;
        if (checked) {
            newCategories = [...selectedCategories, category];
            setSelectedCategories(newCategories);
        } else {
            newCategories = selectedCategories.filter((c) => c !== category);
            setSelectedCategories(newCategories);
        }
        setValue("categories", newCategories);
    };

    const addCustomCategory = () => {
        if (
            customCategory.trim() !== "" &&
            !customCategories.includes(customCategory.trim()) &&
            !getUniqueCategories().includes(customCategory.trim())
        ) {
            const newCustomCategories = [
                ...customCategories,
                customCategory.trim(),
            ];
            setCustomCategories(newCustomCategories);

            const newCategories = [
                ...selectedCategories,
                customCategory.trim(),
            ];
            setSelectedCategories(newCategories);
            setValue("categories", newCategories);

            setCustomCategory("");
        }
    };

    const addTag = () => {
        if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
            const newTags = [...tags, newTag.trim()];
            setTags(newTags);
            setValue("tags", newTags);
            setNewTag("");
        }
    };

    const removeTag = (tag) => {
        const newTags = tags.filter((t) => t !== tag);
        setTags(newTags);
        setValue("tags", newTags);
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
        setValue("variants", newVariants);
    };

    const addVariant = () => {
        const newVariants = [...variants, { color: "", size: "", stock: "" }];
        setVariants(newVariants);
        setValue("variants", newVariants);

        setVariantErrors([...variantErrors, null]);
    };

    const removeVariant = (index) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
        setValue("variants", newVariants);

        const newErrors = [...variantErrors];
        newErrors.splice(index, 1);
        setVariantErrors(newErrors);
    };

    const validateVariants = () => {
        const errors = [];
        let isValid = true;

        variants.forEach((variant, index) => {
            const error = {};
            if (!variant.color) {
                error.color = "Color is required";
                isValid = false;
            }
            if (!variant.size) {
                error.size = "Size is required";
                isValid = false;
            }
            if (!variant.stock) {
                error.stock = "Stock is required";
                isValid = false;
            } else if (
                isNaN(parseInt(variant.stock)) ||
                parseInt(variant.stock) < 0
            ) {
                error.stock = "Stock must be a non-negative number";
                isValid = false;
            }
            errors[index] = Object.keys(error).length ? error : null;
        });

        setVariantErrors(errors);
        return isValid;
    };

    async function addProduct(p) {
        const res = await fetch(`${API_URL}/api/products/add`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(p),
        });
        if (res.ok) {
            return 1;
        }
        return 0;
    }

    async function updateProduct(p) {
        const res = await fetch(
            `${API_URL}/api/products/update/${tab?.data.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(p),
                credentials: "include"
            }
        );
        if (res.ok) {
            return 1;
        }
        return 0;
    }

    const handleScrollToTop = () => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
            contentRef.current.scrollLeft = 0;
        }
    };

    const onUpdate = async (data) => {
        try {
            setSubmitting(true);

            const variantsValid = validateVariants();
            if (!variantsValid) {
                return;
            }

            handleScrollToTop();
            const payload = {
                name: data.name,
                id: data.id,
                price: data.price,
                mrp: data.mrp,
                material: data.material,
                description: data.description,
                category: data.categories,
                tags: data.tags,
                variants: data.variants,
            };
            const res = await updateProduct(payload);

            if (res) {
                setUploading(false);
                setSubmitting(false);
                toast.success("The product has been updated successfully.");
                setOpen(false);
                fetchProducts();
                resetForm();
            } else {
                setUploading(false);
                setSubmitting(false);
                toast.error(
                    "There was an error while updating the product, try again later."
                );
            }
        } catch (error) {
            console.error("Error submitting product:", error);
        }
    };

    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            if (imageFiles.length === 0) {
                setImageError("Please upload at least one product image");
                return;
            }

            const variantsValid = validateVariants();
            if (!variantsValid) {
                return;
            }
            handleScrollToTop();
            setUploading(true);
            const cloudinaryUrls = await Promise.all(
                imageFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", PRESET);
                    formData.append("cloud_name", CLOUDINARY_CLOUD);

                    const response = await fetch(CLOUDINARY_API, {
                        method: "POST",
                        body: formData,
                    });
                    const result = await response.json();
                    return {
                        url: result.secure_url,
                        public_id: result.public_id,
                    };
                })
            );
            setUploading(false);

            const payload = {
                name: data.name,
                id: data.id,
                price: data.price,
                mrp: data.mrp,
                material: data.material,
                description: data.description,
                category: data.categories,
                tags: data.tags,
                variants: data.variants,
                images: cloudinaryUrls,
            };

            const res = await addProduct(payload);

            if (res) {
                setUploading(false);
                setSubmitting(false);
                toast.success("The product has been added successfully.");
                setOpen(false);
                fetchProducts();
                resetForm();
            } else {
                setUploading(false);
                setSubmitting(false);
                toast.error(
                    "There was an error while adding the product, try again later."
                );
            }
        } catch (error) {
            console.error("Error submitting product:", error);
        }
    };
    const resetForm = () => {
        reset();
        setSelectedCategories([]);
        setCustomCategories([]);
        setCustomCategory("");
        setTags([]);
        setNewTag("");
        setImageFiles([]);
        setImagePreviews([]);
        setImageError("");
        setVariants([{ color: "", size: "", stock: "" }]);
        setVariantErrors([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleTagKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    const handleCategoryKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCustomCategory();
        }
    };

    useEffect(() => {
        if (tab?.type === "edit" && tab.data) {
            reset({ ...tab.data });
            setSelectedCategories(tab.data.category || []);
            setVariants(
                tab.data.variants || [{ color: "", size: "", stock: "" }]
            );
            setTags(tab.data.tags || []);
        }
    }, [tab, reset]);

    useEffect(() => {
        EditOpen && setOpen(true);
    }, [EditOpen]);

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                setOpen(newOpen);
                if (!newOpen) {
                    resetForm();
                    setEditOpen({});
                    fetchProducts();
                }
            }}
        >
            <DialogTrigger asChild>
                {tab?.type === "edit" ? (
                    ""
                ) : (
                    <Button className="flex items-center">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                ref={contentRef}
                className="sm:max-w-[600px] h-[calc(100vh-64px)] overflow-y-scroll"
            >
                {submitting && (
                    <div className="absolute w-full h-full opacity-80 z-[5] backdrop-blur-3xl flex items-center justify-center flex-col gap-2">
                        <Loader2 className="animate-spin ease-in-out"></Loader2>
                        <p>
                            {uploading
                                ? "Uplaoding the images"
                                : "Submitting the details"}
                        </p>
                    </div>
                )}
                <DialogHeader>
                    <DialogTitle>
                        {tab?.type ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription>
                        {tab?.type
                            ? "Update the details to edit the existing product."
                            : "Fill in the details to add a new product to your inventory."}
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(
                        tab?.type ? onUpdate : onSubmit,
                        (errors) => {
                            console.log(errors);

                            toast.error(
                                "Please fill all the fields. Make sure that you have entered the details in right format."
                            );
                        }
                    )}
                >
                    <div className="grid gap-4 py-4">
                        <div
                            className={clsx(
                                "flex flex-col gap-2",
                                tab?.type && "hidden"
                            )}
                        >
                            <div className="flex justify-between items-center">
                                <Label htmlFor="images">Product Images</Label>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-500">
                                        {imageFiles.length}/{MAX_IMAGES} images
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Max 1MB per image
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`border-2 border-dashed rounded-md p-4 text-center ${
                                    dragActive
                                        ? "border-primary bg-primary/10"
                                        : imageFiles.length >= MAX_IMAGES
                                        ? "border-gray-300 bg-gray-100 opacity-50"
                                        : "border-gray-300"
                                }`}
                                onDragEnter={
                                    imageFiles.length < MAX_IMAGES
                                        ? handleDrag
                                        : null
                                }
                                onDragOver={
                                    imageFiles.length < MAX_IMAGES
                                        ? handleDrag
                                        : null
                                }
                                onDragLeave={
                                    imageFiles.length < MAX_IMAGES
                                        ? handleDrag
                                        : null
                                }
                                onDrop={
                                    imageFiles.length < MAX_IMAGES
                                        ? handleDrop
                                        : null
                                }
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="sr-only"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    disabled={imageFiles.length >= MAX_IMAGES}
                                />
                                <div className="flex flex-col items-center justify-center">
                                    <Upload
                                        className={`h-8 w-8 mb-2 ${
                                            imageFiles.length >= MAX_IMAGES
                                                ? "text-gray-300"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    {imageFiles.length >= MAX_IMAGES ? (
                                        <p className="text-sm text-gray-500 mb-1">
                                            Maximum of {MAX_IMAGES} images
                                            reached
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-sm text-gray-600 mb-1">
                                                Drag & drop images here, or
                                            </p>
                                            <p className="text-xs text-gray-500 mb-1">
                                                Maximum file size: 1MB per image
                                            </p>
                                        </>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        disabled={
                                            imageFiles.length >= MAX_IMAGES
                                        }
                                    >
                                        Browse Files
                                    </Button>
                                </div>
                            </div>

                            {imageError && (
                                <div className="flex items-center gap-2 text-sm text-red-500">
                                    <AlertCircle className="h-4 w-4" />
                                    <p>{imageError}</p>
                                </div>
                            )}

                            {imagePreviews.length > 0 && (
                                <div className="mt-2">
                                    <Label className="mb-2 block">
                                        Image Previews
                                    </Label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-16 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter product name"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="text"
                                    placeholder="Enter price"
                                    {...register("price")}
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="mrp">MRP</Label>
                                <Input
                                    id="mrp"
                                    type="text"
                                    placeholder="Enter MRP"
                                    {...register("mrp")}
                                />
                                {errors.mrp && (
                                    <p className="text-sm text-red-500">
                                        {errors.mrp.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="material">Material</Label>
                            <Input
                                id="material"
                                placeholder="Enter material"
                                {...register("material")}
                            />
                            {errors.material && (
                                <p className="text-sm text-red-500">
                                    {errors.material.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter product description"
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Categories</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {getUniqueCategories().map((category) => (
                                    <div
                                        key={category}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`category-${category}`}
                                            checked={selectedCategories.includes(
                                                category
                                            )}
                                            onCheckedChange={(checked) => {
                                                handleCategoryChange(
                                                    category,
                                                    checked
                                                );
                                            }}
                                        />
                                        <Label htmlFor={`category-${category}`}>
                                            {category}
                                        </Label>
                                    </div>
                                ))}

                                {customCategories.map((category) => (
                                    <div
                                        key={`custom-${category}`}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`category-${category}`}
                                            checked={selectedCategories.includes(
                                                category
                                            )}
                                            onCheckedChange={(checked) => {
                                                handleCategoryChange(
                                                    category,
                                                    checked
                                                );
                                            }}
                                        />
                                        <Label
                                            htmlFor={`category-${category}`}
                                            className="flex items-center"
                                        >
                                            {category}
                                            <Badge
                                                variant="outline"
                                                className="ml-1 text-xs"
                                            >
                                                custom
                                            </Badge>
                                        </Label>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 items-center">
                                <Input
                                    placeholder="Add custom category"
                                    value={customCategory}
                                    onChange={(e) =>
                                        setCustomCategory(e.target.value)
                                    }
                                    onKeyPress={handleCategoryKeyPress}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={addCustomCategory}
                                    disabled={!customCategory.trim()}
                                >
                                    Add
                                </Button>
                            </div>

                            {selectedCategories.length === 0 &&
                                errors.categories && (
                                    <p className="text-sm text-red-500">
                                        {errors.categories.message}
                                    </p>
                                )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Tags</Label>
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="rounded-full hover:bg-gray-200 p-1"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2 items-center">
                                <Input
                                    placeholder="Add product tag"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={handleTagKeyPress}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={addTag}
                                    disabled={!newTag.trim()}
                                >
                                    Add
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                                Press Enter to add multiple tags
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 border-t pt-4 mt-2">
                            <div className="flex justify-between items-center">
                                <Label>Product Variants</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addVariant}
                                    className="flex items-center gap-1"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add Variant
                                </Button>
                            </div>

                            {variants.length === 0 && (
                                <p className="text-sm text-red-500">
                                    Add at least one variant
                                </p>
                            )}

                            {variants.map((variant, index) => (
                                <div
                                    key={index}
                                    className="p-3 border rounded-md relative"
                                >
                                    <div className="absolute top-0 right-0">
                                        {variants.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    removeVariant(index)
                                                }
                                                className="h-8 w-8 p-0"
                                            >
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <Label
                                                htmlFor={`variant-${index}-color`}
                                            >
                                                Color
                                            </Label>
                                            <Input
                                                id={`variant-${index}-color`}
                                                placeholder="e.g., Red, Blue"
                                                value={variant.color}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        index,
                                                        "color",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {variantErrors[index]?.color && (
                                                <p className="text-xs text-red-500">
                                                    {variantErrors[index].color}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <Label
                                                htmlFor={`variant-${index}-size`}
                                            >
                                                Size
                                            </Label>
                                            <Select
                                                value={variant.size}
                                                onValueChange={(value) =>
                                                    updateVariant(
                                                        index,
                                                        "size",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id={`variant-${index}-size`}
                                                >
                                                    <SelectValue placeholder="Select size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SIZE_OPTIONS.map(
                                                        (size) => (
                                                            <SelectItem
                                                                key={size}
                                                                value={size}
                                                            >
                                                                {size}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {variantErrors[index]?.size && (
                                                <p className="text-xs text-red-500">
                                                    {variantErrors[index].size}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <Label
                                                htmlFor={`variant-${index}-stock`}
                                            >
                                                Stock
                                            </Label>
                                            <Input
                                                id={`variant-${index}-stock`}
                                                placeholder="Available quantity"
                                                type="number"
                                                min="0"
                                                value={variant.stock}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        index,
                                                        "stock",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {variantErrors[index]?.stock && (
                                                <p className="text-xs text-red-500">
                                                    {variantErrors[index].stock}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="flex flex-row justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetForm}
                            className="mr-2"
                            disabled={submitting || tab?.type === "edit"}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            className="w-28"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader className="animate-spin "></Loader>
                            ) : tab?.type === "edit" ? (
                                "Edit Product"
                            ) : (
                                "Add Product"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddProduct;

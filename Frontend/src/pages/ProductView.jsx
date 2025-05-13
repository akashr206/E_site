import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Loading from "../components/Loading";
import Prompt from "../components/ui/Prompt";
import { API_URL } from "../config/api";
import { useAuth } from "../Contexts/AuthContext";
import { CartLength } from "../Contexts/CartContext";
import ProductGallery from "@/components/Product/ProductGallery";
import ProductInfo from "@/components/Product/ProductInfo";
import ProductVariants from "@/components/Product/ProductVariants";
import AddToCartButton from "@/components/Product/AddtoCartButton";
import ProductDescription from "@/components/Product/ProductDescription";
import ReviewSection from "@/components/Product/ReviewSection";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const ProductView = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [colors, setColors] = useState(null);
    const [sizes, setSizes] = useState([" "]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [added, setAdded] = useState(false);
    const [error, setError] = useState(false);
    const { user } = useAuth();
    const [prompt, setPrompt] = useState(false);
    const { fetchCart } = useContext(CartLength);
    const [ratings, setRatings] = useState(null);
    const [isWishlist, setISWishlist] = useState(false);

    function handleSelectColor(color) {
        setSelectedColor(color);
    }

    useEffect(() => {
        if (colors) {
            const selected = colors.find(
                (c) => Object.keys(c)[0] === selectedColor
            );
            setSizes(selected[selectedColor]);
            setSelectedSize(selected[selectedColor][0]);
        }
    }, [selectedColor]);

    function fetchSizes(product) {
        const varies = product.variants;
        const colors = {};
        varies.forEach((vary) => {
            let color = vary.color.toLowerCase();
            const size = vary.size;
            const stock = vary.stock;

            color = color.charAt(0).toUpperCase() + color.slice(1);
            if (!colors[color]) {
                colors[color] = new Set();
            }

            if (stock > 0) {
                colors[color].add(size);
            }
        });

        const formattedColors = Object.keys(colors).map((color) => {
            return { [color]: Array.from(colors[color]) };
        });

        setColors(formattedColors);
        setSelectedColor(Object.keys(formattedColors[0])[0]);
    }

    const fetchRatings = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/reviews/ratings/${id}`
            );
            if (response.status === 200) {
                const data = await response.json();
                console.log(data);

                setRatings(data);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    async function handleWishlist() {
        try {
            if (!user) {
                setPrompt(true);
                return;
            }
            const res = await fetch(`${API_URL}/api/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: id,
                }),
                credentials: "include",
            });
            if (res.status === 201) {
                toast.success("Product added to you wishlist");
                setISWishlist(true);
            } else if (res.status === 400) {
                const { message } = await res.json();
                toast.error(message);
            } else {
                toast.error("Unexpected error, try again later");
            }
        } catch (error) {
            toast.error("Unexpected error, try again later");
        }
    }

    async function removeWishlist() {
        if (!user) {
            setPrompt(true);
            return;
        }
        const res = await fetch(`${API_URL}/api/wishlist`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: id,
            }),
            credentials: "include",
        });
        if (res.status === 200) {
            toast.success("Product removed from your wishlist");
            setISWishlist(false);
        } else {
            toast.error("Unexpected error, try again later");
        }
    }

    async function checkWishlist() {
        if (!user) {
            return;
        }
        const res = await fetch(`${API_URL}/api/wishlist/${id}`, {
            credentials: "include",
        });
        if (res.status === 200) {
            const data = await res.json();

            setISWishlist(data.isWishlist);
        } else {
            setISWishlist(false);
        }
    }

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(
                    `${API_URL}/api/products/one/${id}`
                );
                if (response.status === 200) {
                    const data = await response.json();
                    setProduct(data);
                    if (data.variants?.length > 0) {
                        fetchSizes(data);
                        setSelectedVariant(data.variants[0]);
                    }
                    if (data.images?.length > 0) {
                        setSelectedImage(data.images[0]);
                    }
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        }
        Promise.all([fetchProduct(), fetchRatings(), checkWishlist()]);
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            setPrompt(true);
            return;
        }

        if (!selectedColor && !selectedSize) return;
        setIsAdding(true);
        setAdded(false);

        const response = await fetch(`${API_URL}/api/cart/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: id,
                name: product.name,
                images: product.images,
                price: product.price,
                quantity: 1,
                color: selectedColor,
                size: selectedSize,
                mrp: product.mrp,
            }),
            credentials: "include",
        });

        setIsAdding(false);

        if (response.status === 201) {
            setAdded(true);
            setTimeout(() => setAdded(false), 1000);
            fetchCart();
        }
        if (response.status === 200) {
            setIsUpdated(true);
            setTimeout(() => setIsUpdated(false), 1000);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600">
                        Product Not Found
                    </h1>
                    <p className="mt-2 text-gray-600">
                        There was an error finding the product you're looking
                        for.
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return <Loading />;
    }

    return (
        <div className="bg-background">
            {prompt && (
                <Prompt
                    title="Login Required"
                    text="You need to log in to add items to your cart"
                    to="login"
                    toValue="Login"
                    close={() => setPrompt(false)}
                />
            )}

            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 items-start">
                    <ProductGallery
                        images={product.images}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        productName={product.name}
                    />

                    <div className="mt-10 lg:mt-0 lg:pl-8">
                        <ProductInfo
                            product={product}
                            material={product.material}
                            ratings={ratings}
                        />

                        <Separator className="my-6" />

                        <ProductVariants
                            colors={colors || []}
                            sizes={sizes}
                            selectedColor={selectedColor}
                            selectedSize={selectedSize}
                            handleSelectColor={handleSelectColor}
                            setSelectedSize={setSelectedSize}
                        />

                        <AddToCartButton
                            handleAddToCart={handleAddToCart}
                            isAdding={isAdding}
                            added={added}
                            isUpdated={isUpdated}
                            handleWishlist={handleWishlist}
                            isWishlist={isWishlist}
                            removeWishlist={removeWishlist}
                        />

                        <ProductDescription description={product.description} />
                        <ReviewSection
                            productId={id}
                            fetchRatings={fetchRatings}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductView;

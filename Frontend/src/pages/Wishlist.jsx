import { useState, useEffect } from "react";
import { Separator } from "../components/ui/separator";
import Loading from "../components/Loading";
import ProductsGrid from "../components/ProductsGrid";
import SortProducts from "../components/SortProducts";
import { API_URL } from "../config/api";
import { useAuth } from "../Contexts/AuthContext";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/ui/button";

const NonWishlist = () => {
    return (
        <div className="flex items-center justify-center absolute w-full -z-10 top-0 h-screen px-4">
            <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <LockClosedIcon className="w-12 h-12 text-pink-500 mx-auto mb-4" />

                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Your Wishlist is Locked
                </h1>
                <p className="text-gray-500 mb-6">
                    Login to unlock your wish list and start wish listing your
                    favorite items!
                </p>

                <Button
                    onClick={() =>
                        (window.location.href = `${API_URL}/auth/google`)
                    }
                >
                    <span>Login Now</span>
                </Button>
            </div>
        </div>
    );
};

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, loadingUser } = useAuth();

    useEffect(() => {
        async function fetchProducts() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/`, {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const products = await response.json();
                setProducts(products);
                setFilteredProducts(products);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const handleSortChange = (sortby) => {
        let sorted = [...filteredProducts];

        switch (sortby) {
            case "Newest":
                sorted.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                break;
            case "Oldest":
                sorted.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                break;
            case "Price: low to high":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "Price: high to low":
                sorted.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        setFilteredProducts(sorted);
    };

    const handleFilterChange = ({ minPrice, maxPrice }) => {
        const filtered = products.filter(
            (product) =>
                product.price >= (minPrice || 0) &&
                product.price <= (maxPrice || Infinity)
        );
        setFilteredProducts(filtered);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!user && !loadingUser) return <NonWishlist />;

    return (
        <div className="p-2 flex flex-col justify-center items-center mx-auto max-w-7xl">
            <div className="my-2 px-5 w-full flex gap-2 p-6 flex-col sm:items-center sm:flex-row justify-between ">
                <div className="flex  flex-col">
                    <h1 className="text-3xl font-normal">Wishlist</h1>
                    <p className="text-accent-foreground/60 text-sm">
                        {" "}
                        {products.length}{" "}
                        {products.length === 1 ? "product" : "products"}
                    </p>
                </div>
                <SortProducts onSortChange={handleSortChange} />
            </div>
            <Separator></Separator>
            <div className="py-6">
                {!products || products.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                        There are no wishlisted products.
                    </div>
                ) : (
                    <ProductsGrid products={filteredProducts} />
                )}
            </div>
        </div>
    );
};

export default Wishlist;

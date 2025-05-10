import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Separator } from "../components/ui/separator";
import Loading from "../components/Loading";
import ProductsGrid from "../components/ProductsGrid";
import FilterAndSort from "../components/FilterAndSort";
import { API_URL } from "../config/api";

const Category = () => {
    const { query } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${API_URL}/search?query=${query}`
                );
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
    }, [query]);

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

    if (!products || products.length === 0) {
        return (
            <div className="text-center flex flex-col justify-center items-center">
                <p className="text-gray-500 py-6 text-lg">
                    No products found for "{query}"
                </p>
            </div>
        );
    }

    return (
        <div className="p-2 flex flex-col justify-center items-center mx-auto max-w-7xl">
            <div className="my-2 px-5 w-full flex gap-2 p-6 flex-col sm:items-center sm:flex-row justify-between ">
                <div className="flex  flex-col">
                    <h1 className="text-3xl font-normal">
                        {query.toUpperCase()}
                    </h1>
                    <p className="text-accent-foreground/60 text-sm"> {products.length} {products.length === 1 ? "product" : "products"}</p>
                </div>
                <FilterAndSort
                    onSortChange={handleSortChange}
                    onFilterChange={handleFilterChange}
                />
            </div>
            <Separator></Separator>
            <div className="py-6">
                <ProductsGrid products={filteredProducts} />
            </div>
        </div>
    );
};

export default Category;

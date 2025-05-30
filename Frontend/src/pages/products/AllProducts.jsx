import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/Loading";
import ProductsGrid from "@/components/ProductsGrid";
import SortProducts from "@/components/SortProducts";
import { API_URL } from "@/config/api";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = 30;

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    async function fetchProducts() {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/products/all?limit=${LIMIT}&page=${page}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const products = await response.json();
            if (products.products.length < LIMIT) {
                console.log("No more products");
                setHasMore(false);
            }
            setPage((prev) => prev + 1);
            setProducts(prevProducts => [...prevProducts, ...products.products]);
            setFilteredProducts(prevProducts => [...prevProducts, ...products.products]);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
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

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="p-2 flex flex-col justify-center items-center mx-auto max-w-7xl">
            <div className="my-2 px-5 w-full flex gap-2 p-6 flex-col sm:items-center sm:flex-row justify-between ">
                <div className="flex  flex-col">
                    <h1 className="text-3xl font-normal">All Products</h1>
                    <p className="text-accent-foreground/60 text-sm">
                        {" "}
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "product" : "products"}
                    </p>
                </div>
                <SortProducts onSortChange={handleSortChange} />
            </div>
            <Separator></Separator>
            <div className="py-6">
                {!products || products.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                        There are no newly arrived products.
                    </div>
                ) : (
                    <>
                        <InfiniteScroll
                            dataLength={filteredProducts.length}
                            next={fetchProducts}
                            hasMore={hasMore}
                            loader={<h4>Loading more...</h4>}
                            endMessage={
                                <p style={{ textAlign: "center" }}>
                                    Yay! You have seen it all
                                </p>
                            }
                        >
                            <ProductsGrid products={filteredProducts} />
                        </InfiniteScroll>
                    </>
                )}
            </div>
        </div>
    );
};

export default AllProducts;

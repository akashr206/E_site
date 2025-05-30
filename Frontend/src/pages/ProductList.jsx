import { useState, useEffect } from "react";
import { Separator } from "../components/ui/separator";
import Loading from "../components/Loading";
import ProductsGrid from "../components/ProductsGrid";
import SortProducts from "../components/SortProducts";
import { API_URL } from "../config/api";
import { useSearchParams } from "react-router-dom";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductList = ({ endpoint, title, limit, noProductMessage }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(
        parseInt(searchParams.get("page"), 10) || 1
    );
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = limit || 10;

    async function fetchProducts(sortby = "Newest") {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/${endpoint}?limit=${itemsPerPage}&page=${page}&sort=${sortby}`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const products = await response.json();
            setProducts(products.products);
            setFilteredProducts(products.products);
            setTotalPages(products.pagination.totalPages);
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
    }, [page]);

    function handlePageChange(page) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        setSearchParams(params);
        setPage(page);
    }

    const handleSortChange = (sortby) => {
        if (page == 1) {
            fetchProducts(sortby);
        } else {
            handlePageChange(1);
        }
        let sorted = [...filteredProducts];

        setFilteredProducts(sorted);
    };

   

    return (
        <div className="p-2 flex flex-col justify-center items-center mx-auto max-w-7xl">
            <div className="my-2 px-5 w-full flex gap-2 p-6 flex-col sm:items-center sm:flex-row justify-between ">
                <div className="flex  flex-col">
                    <h1 className="text-3xl font-normal">{title}</h1>
                    <p className="text-accent-foreground/60 text-sm">
                        {" "}
                        {products?.length || 0}{" "}
                        {products?.length === 1 ? "product" : "products"}
                    </p>
                </div>
                <SortProducts onSortChange={handleSortChange} />
            </div>
            <Separator></Separator>
            <div className="py-6">
                {!products || products.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                        {noProductMessage}
                    </div>
                ) : (
                    <ProductsGrid products={filteredProducts} />
                )}
            </div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <Button
                            onClick={() => handlePageChange(page - 1)}
                            variant={"ghost"}
                            disabled={page === 1}
                        >
                            <ChevronLeft /> Prev
                        </Button>
                    </PaginationItem>
                    <PaginationItem>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <PaginationLink key={i} asChild>
                                <Button
                                    onClick={() => handlePageChange(i + 1)}
                                    variant={"ghost"}
                                >
                                    {i + 1}
                                </Button>
                            </PaginationLink>
                        ))}
                    </PaginationItem>
                    <PaginationItem>
                        <Button
                            variant={"ghost"}
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className="cursor-pointer"
                        >
                            Next <ChevronRight />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default ProductList;

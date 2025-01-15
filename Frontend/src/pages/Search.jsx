import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useSearchParams } from "react-router-dom";
import Product from "../components/Product";
import ProductsGrid from "../components/ProductsGrid";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_APIURL}/search?query=${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [query]);

  if (isLoading) {
    return <Loading />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">No products found for "{query}"</p>
      </div>
    );
  }

  return(
    <div>
      <h1 className="text-gray-600 my-3 font-semibold text-center text-lg mb-4">Search results for "{query}"</h1>
      <ProductsGrid products = {products}></ProductsGrid>
    </div>
  );
};

export default Search;

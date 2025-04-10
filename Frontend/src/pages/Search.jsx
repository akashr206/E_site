import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import FilterAndSort from "../components/FilterAndSort";
import ProductsGrid from "../components/ProductsGrid";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
        setFilteredProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [query]);

  const handleSortChange = (sortby) => {
    let sorted = [...filteredProducts];

    switch (sortby) {
      case 'Newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'Oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'Price: low to high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'Price: high to low':
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
        product.price >= (minPrice || 0) && product.price <= (maxPrice || Infinity)
    );
    setFilteredProducts(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-xl font-semibold text-gray-900">No results found</h2>
          <p className="mt-1 text-gray-500">
            We couldn't find any products matching "{query}". Try checking your spelling or using different keywords.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen relative pb-96">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-border pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sticky top-0 sm:mb-0">
              <h1 className="text-2xl font-semibold tracking-tight ">
                Search Results for "{query}"
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <FilterAndSort 
                onSortChange={handleSortChange} 
                onFilterChange={handleFilterChange} 
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ProductsGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
};

export default Search;
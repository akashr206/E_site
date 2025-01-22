import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import ProductsGrid from "../components/ProductsGrid";
import { API_URL } from '../config/api';

const Category = () => {
  const { query } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => {

    async function fetchProducts() {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/search?query=${query}`);
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
  function capitalizeFirstLetter(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <div className='p-2 flex flex-col justify-center items-center'>
      <div className='my-2 w-full flex justify-between max-w-5xl sont bold'>
        Category &#9658; {capitalizeFirstLetter(query)}

        <div className='flex '>
          <button className='p-2 m-2 border rounded-md border-grqy-800'>
            Filter
          </button>
          <button className='p-2 m-2 border rounded-md border-grqy-800'>
            Sort by
          </button>
        </div>
      </div>
      <ProductsGrid products={products}></ProductsGrid>
    </div>
  );
}

export default Category

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Product from "../components/Product";
import { API_URL } from '../config/api';

const Category = () => {
    const  {query}  = useParams();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
  
    return (
      <div>
        {isloading && <Loading></Loading>}
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}

export default Category

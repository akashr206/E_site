import React from "react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Product from "./Product";

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchProducts() {
    try {
      const response = await fetch(`${import.meta.env.VITE_APIURL}/api/products/all`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const products = await response.json();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  }

  useEffect(() => {
    async function loadData() {
      await fetchProducts();
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">No products available</p>
      </div>
    );
  }

  return (
    <div>
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
};

export default ProductsGrid;

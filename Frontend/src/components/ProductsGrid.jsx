import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import Product from "./Product";

// const products = [
//     {
//       id: 1,
//       name: 'Basic Tee',
//       href: '#',
//       imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg',
//       imageAlt: "Front of men's Basic Tee in black.",
//       price: '$35',
//       color: 'Black',
//     },
//     // More products...
//   ]
const ProductsGrid = () => {
  const [products, setproducts] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  async function fetchProducts() {
    const response = await fetch("http://localhost:5000/api/products/all");
    const products = await response.json();
    setproducts(products);
  }

  useEffect(() => {
    async function loadData() {
      await Promise.all([fetchProducts()]);
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (!products) {
    return <Loading></Loading>;
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
};

export default ProductsGrid;

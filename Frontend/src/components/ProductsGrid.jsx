import React from "react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Product from "./Product";

const ProductsGrid = ({products}) => {
  // const [products, setProducts] = useState([]);
  


  

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
        <div className="mx-auto max-w-3xl px-4 md:px-8 lg:max-w-7xl ">
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
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

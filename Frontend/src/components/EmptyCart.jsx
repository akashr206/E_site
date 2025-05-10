import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCartIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const EmptyCart = () => {
  return (
    <div className="flex items-center justify-center absolute w-full -z-10 top-0 h-screen px-4">
      <div className="flex flex-col items-center text-center bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
        <div className="bg-pink-100 p-4 rounded-full mb-4">
          <ShoppingCartIcon className="h-12 w-12 text-pink-500" />
        </div>
        <p className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</p>
        <p className="text-gray-500 mb-6">
          It looks like you haven’t added any items to your cart yet.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 text-pink-500 hover:text-pink-500 text-lg font-medium"
        >
          Continue Shopping
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;

import React from "react";
import {Link} from "react-router-dom";

const Product = (props) => {
  return (
    <div key={props.product.id} className="group relative">
      <img
        src={props.product.images[0]}
        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
      />
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/products/${props.product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {props.product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{props.product.color}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{props.product.price}</p>
      </div>
      <div className="py-2">
        <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Product;

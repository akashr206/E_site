'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'

const product = {
  id: 1,
  name: 'Throwback Hip Bag',
  href: '#',
  color: 'Salmon',
  size: "M",
  price: 'Rs. 90.00',
  quantity: 1,
  imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
  imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.'
}


const CartItem = (product) => {
  const [quantity, setquantity] = useState(1)

  return (
    <div className="flex items-start bg-white p-6 rounded-lg shadow">
      <img
        src={product.image}
        className="w-24 h-24 rounded-lg object-cover"
      />
      <div className="ml-4 flex-1">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-500">{product.color} &bull; {product.size}</p>
        <p className="mt-2 text-gray-700 font-medium">{product.price}</p>

      </div>
      <div className="flex flex-col items-center  space-x-2">
      <button className="text-gray-400 flex justify-end w-full hover:text-red-500">
          <span>&#10006;</span>
        </button>
        <Menu as="div" className="relative inline-block text-left m-4">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ">
              {quantity}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1 ">
              <MenuItem>
                <a
                  onClick={()=>setquantity(1)}
                  className="block px-4 py-2 w-max text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  1
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  onClick={()=>setquantity(2)}
                  className="block px-4 py-2 w-max text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  2
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  onClick={()=>setquantity(3)}
                  className="block px-4 py-2 w-max text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  3
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
        
      </div>
    </div>


  )
}
export default function Cart() {
  const [products, setProducts] = useState([])
  useEffect(() => {
  async function fetchCart(){
    const response = await fetch('http://localhost:5000/api/cart/user',{credentials : 'include'})
    const products = await response.json()
    console.log(products);
    
    setProducts(products)
  }
    fetchCart()
    
  }, [])
  
  return (
    <div className="max-w-7xl px-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {products.map((product)=>{
            return <CartItem name={product.name} image = {product.images[0]} color = {product.color} size = {product.size} price = {product.price}/>
          })}          
        </div>

        {/* Right Section: Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">$99.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping estimate</span>
              <span className="font-medium">$5.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax estimate</span>
              <span className="font-medium">$8.32</span>
            </div>
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Order total</span>
              <span>$112.32</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-500">
            Checkout
          </button>
        </div>
      </div>
    </div>

  )
}

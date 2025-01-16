'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import EmptyCart from '../components/EmptyCart';
import { useAuth } from '../Contexts/AuthContext.';
import { API_URL } from '../config/api';
const NonCart = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center absolute w-full -z-10 top-0 h-screen px-4">
      <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        
        <LockClosedIcon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! Your Cart is Locked
        </h1>
        <p className="text-gray-600 mb-6">
          Login to unlock your cart and start adding your favorite items!
        </p>
        
        <button

          onClick={() => navigate("/login")}
          className="bg-indigo-600 mx-auto text-white hover:bg-indigo-700 px-6 py-2 rounded-lg text-lg font-semibold flex items-center justify-center space-x-2"
        >
          <span>Login Now</span>
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};


const CartItem = (product) => {
  
  const [quantity, setquantity] = useState(1)
  const [stock, setStock] = useState(3)
  
  

  useEffect(() => {
    async function fetchStock() {
      let response = await fetch(`${API_URL}/api/products/stock/${product.productId}?color=${product.color}&size=${product.size}`)
      let data = await response.json();
      if (data.stock < 3) {
        setStock(data.stock);
      }
    }
    fetchStock();
  }, [])

  return (
    <div className="flex items-start bg-white p-3 rounded-lg shadow">
      <Link className='w-24 h-24 flex justify-center items-center' to={`/products/${product.productId}`}>
        <img
          src={product.image}
          className="h-full rounded-md object-contain"
        />
      </Link>
      <div className="ml-4 flex-1">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-500">{product.color} &bull; {product.size}</p>
        <p className="mt-2 text-gray-700 font-medium">{product.price}</p>
      </div>
      <div className="flex flex-col items-center space-x-2">
        <button onClick={() => product.OnRemove(product.id)} className="text-gray-400 flex justify-end w-full hover:text-red-500">
          <span>&#10006;</span>
        </button>
        <Menu as="div" className="relative inline-block text-left m-4">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {product.quantity}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1 ">
              {Array.from({ length: stock }, (_, index) => (
                <MenuItem key={index}>
                  <a
                    onClick={() => product.onUpdate(product.id, index + 1)}
                    className="block cursor-pointer px-4 py-2 w-max text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    {index + 1}
                  </a>
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Menu>
      </div>
    </div>
  )
}

export default function Cart() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [isEmpty, setIsEmpty] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const {user, loadingUser} = useAuth()
  
  async function fetchCart() {
    const response = await fetch(`${API_URL}/api/cart/user`, { credentials: 'include' })
    const products = await response.json()
    if (products.length === 0) {
      setIsEmpty(true)
    } else {
      setIsEmpty(false)
    }
    setProducts(products)
  }

  async function removeItem(id) {
    setIsLoading(true)
    const response = await fetch(`${API_URL}/api/cart/remove/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    await fetchCart()
    setIsLoading(false)
  }

  async function updateQuantity(id, quantity) {
    const response = await fetch(`${API_URL}/api/cart/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity, cartItemId: id }),
      credentials: 'include'
    });
    const data = await response.json();
    fetchCart()
    fetchTotal()
    return data;
  }
  async function fetchTotal() {
    setIsLoading(true)
    const response = await fetch(`${API_URL}/api/cart/total`, { credentials: 'include' })
    const data = await response.json()    
    setTotal(data.totalPrice)
    setIsLoading(false)
  }

  useEffect(() => {

    async function loadData() {
      try {
        setIsLoading(true);
        await Promise.all([fetchCart(), fetchTotal()]);
      } catch (error) {
        console.error("Error loading cart data:", error);
      } finally {
        setIsLoading(false);
      }
    }
      loadData();
  }, [])

  if (isLoading ) return <Loading />
  if (!user && !loadingUser) return <NonCart />
  return (
    <>
      <div className="max-w-7xl relative px-3 py-5 lg:px-8 mx-auto">
        {isEmpty ? <EmptyCart /> : (
          <div>
            <h1 className='text-2xl font-bold mb-5'>Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {products.map((product) => {
                return <CartItem onUpdate={(id,quantity)=>updateQuantity(id,quantity)} OnRemove={removeItem} id={product._id} productId={product.productId} key={product._id} name={product.name} image={product.images[0]} color={product.color} quantity={product.quantity} size={product.size} price={product.price} />
              })}
            </div>
            <div className="bg-white p-6 h-max rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Order summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{total}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping estimate</span>
                  <span className="font-medium">₹100.00</span>
                </div>
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Order total</span>
                  <span>₹{total + 100}.00</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-500">
                Checkout
              </button>
            </div>
          </div>
          </div>
        )}
      </div>
    </>
  )
}

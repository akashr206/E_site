'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import Loading from '../components/Loading'

const CartItem = (product) => {
  const [quantity, setquantity] = useState(1)
  const [stock, setStock] = useState(3)
  const API_URL = import.meta.env.VITE_APIURL;
  async function updateQuantity(id, quantity) {
    setquantity(quantity)
    const response = await fetch(`${API_URL}//api/cart/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity, cartItemId: id }),
      credentials: 'include'
    });
    const data = await response.json();
    product.OnTotal()
    return data;
  }

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
    <div className="flex items-start bg-white p-6 rounded-lg shadow">
      <Link to={`/products/${product.productId}`}>
        <img
          src={product.image}
          className="w-24 h-24 rounded-lg object-cover"
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
              {quantity}
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
                    onClick={() => updateQuantity(product.id, index + 1)}
                    className="block px-4 py-2 w-max text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
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
  const API_URL = import.meta.env.VITE_APIURL;
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
        setIsLoading(true)
        await Promise.all([fetchCart(), fetchTotal()])
      } catch (error) {
        console.error("Error loading cart data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if(isLoading) return <Loading />

  return (
    <>
      <div className="max-w-7xl px-3 lg:px-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-center bg-white p-6 rounded-lg shadow">
            <p className="text-2xl font-bold mb-6">Your cart is empty</p>
            <Link to="/products" className="mt-4 text-indigo-600 hover:text-indigo-500 text-lg font-medium">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {products.map((product) => {
                return <CartItem OnTotal={fetchTotal} OnRemove={removeItem} id={product._id} productId={product.productId} key={product._id} name={product.name} image={product.images[0]} color={product.color} size={product.size} price={product.price} />
              })}
            </div>
            <div className="bg-white p-6 h-max rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Order summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${total}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping estimate</span>
                  <span className="font-medium">$100.00</span>
                </div>
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Order total</span>
                  <span>${total + 100}.00</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-500">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

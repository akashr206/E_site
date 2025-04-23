import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import {
    ChevronRight,
    Heart,
    Truck,
    RefreshCw,
    ShieldCheck,
    CreditCard,
} from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    async function fetchProducts() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_APIURL}/api/products/all`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            setProducts(data.products);
            console.log(data.products);
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

    return (
        <div>
            <section className="relative">
                <div className=" h-[80vh] max-sm:h-[70vh] w-[100vw] relative overflow-hidden">
                    <img
                        src="/hero.png"
                        alt="Elegant woman in bridal wear"
                        className="md:w-full overflow-hidden absolute h-full object-cover md:object-contain md:object-right"
                    />
                    <div className="absolute lg:ml-32 inset-0 bg-gradient-to-r from-white to-black/20 flex items-center">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-lg max-md:max-w-56">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pink-600 leading-tight mb-4">
                                    Elegance That Speaks for Itself
                                </h1>
                                <p className="text-lg text-gray-700 mb-8">
                                    Show your shine with a collection full of
                                    beauty, feeling, and a touch of magic.
                                </p>
                                <div className="flex  gap-4">
                                    <Button className="px-6 py-3 font-medium rounded-md transition-colors">
                                        Shop now <ArrowUpRight />
                                    </Button>
                                    <Button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                                        Explore Collection
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl  font-bold text-center mb-12">
                        Shop by Category
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group relative overflow-hidden rounded-lg h-[400px]">
                            <img
                                src="/placeholder.svg?height=600&width=400"
                                alt="Women's Fashion"
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <div>
                                    <h3 className="text-xl font-medium text-white mb-2">
                                        Women's Fashion
                                    </h3>
                                    <a
                                        href="#"
                                        className="inline-flex items-center text-white text-sm font-medium"
                                    >
                                        Shop Now{" "}
                                        <ChevronRight
                                            size={16}
                                            className="ml-1"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-lg h-[400px]">
                            <img
                                src="/placeholder.svg?height=600&width=400"
                                alt="Bridal Collection"
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <div>
                                    <h3 className="text-xl font-medium text-white mb-2">
                                        Bridal Collection
                                    </h3>
                                    <a
                                        href="#"
                                        className="inline-flex items-center text-white text-sm font-medium"
                                    >
                                        Shop Now{" "}
                                        <ChevronRight
                                            size={16}
                                            className="ml-1"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-lg h-[400px]">
                            <img
                                src="/placeholder.svg?height=600&width=400"
                                alt="Accessories"
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <div>
                                    <h3 className="text-xl font-medium text-white mb-2">
                                        Accessories
                                    </h3>
                                    <a
                                        href="#"
                                        className="inline-flex items-center text-white text-sm font-medium"
                                    >
                                        Shop Now{" "}
                                        <ChevronRight
                                            size={16}
                                            className="ml-1"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl  font-bold">New Arrivals</h2>
                        <a
                            href="#"
                            className="text-sm font-medium text-gray-900 hover:text-pink-500 inline-flex items-center"
                        >
                            View All <ChevronRight size={16} className="ml-1" />
                        </a>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.slice(0, 4).map((product) => (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                            >
                                <div className="group">
                                    <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
                                        <img
                                            src={product.images[0]}
                                            alt="Elegant Dress"
                                            className="w-full h-[350px] hover:scale-105 transition-transform object-cover object-top"
                                        />
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white rounded-full text-gray-900 hover:text-pink-500">
                                                <Heart size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 mb-2">
                                        {product.name}
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {product.price}.00
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl  font-bold mb-4">
                            Shop Our Collections
                        </h2>
                        <p className="text-gray-700 max-w-3xl mx-auto">
                            Browse our carefully curated collections of women's
                            fashion and bridal wear. From everyday elegance to
                            your special day, find the perfect pieces for every
                            occasion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative overflow-hidden rounded-lg group">
                            <img
                                src="/placeholder.svg?height=600&width=800"
                                alt="Bridal Collection"
                                className="w-full h-[400px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-2xl  font-bold text-white mb-2">
                                    Bridal Collection
                                </h3>
                                <p className="text-white mb-6 max-w-md">
                                    Stunning gowns and accessories for your
                                    perfect wedding day
                                </p>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors">
                                        Shop Now
                                    </button>
                                    <button className="px-6 py-3 bg-pink-500 text-white font-medium rounded-md hover:bg-pink-600 transition-colors">
                                        View Catalog
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-lg group">
                            <img
                                src="/placeholder.svg?height=600&width=800"
                                alt="Women's Fashion"
                                className="w-full h-[400px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-2xl  font-bold text-white mb-2">
                                    Women's Fashion
                                </h3>
                                <p className="text-white mb-6 max-w-md">
                                    Elegant and stylish pieces for every
                                    occasion and season
                                </p>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors">
                                        Shop Now
                                    </button>
                                    <button className="px-6 py-3 bg-pink-500 text-white font-medium rounded-md hover:bg-pink-600 transition-colors">
                                        View Catalog
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <a
                            href="#"
                            className="bg-gray-100 p-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
                        >
                            <h4 className="font-medium">Dresses</h4>
                        </a>
                        <a
                            href="#"
                            className="bg-gray-100 p-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
                        >
                            <h4 className="font-medium">Bridal Gowns</h4>
                        </a>
                        <a
                            href="#"
                            className="bg-gray-100 p-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
                        >
                            <h4 className="font-medium">Accessories</h4>
                        </a>
                        <a
                            href="#"
                            className="bg-gray-100 p-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
                        >
                            <h4 className="font-medium">New Arrivals</h4>
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl  font-bold">Best Sellers</h2>
                        <a
                            href="#"
                            className="text-sm font-medium text-gray-900 hover:text-pink-500 inline-flex items-center"
                        >
                            View All <ChevronRight size={16} className="ml-1" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="group">
                            <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
                                <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    BEST SELLER
                                </span>
                                <img
                                    src="/placeholder.svg?height=400&width=300"
                                    alt="Silk Evening Gown"
                                    className="w-full h-[350px] object-cover object-center"
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white rounded-full text-gray-900 hover:text-pink-500">
                                        <Heart size={20} />
                                    </button>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-white py-4 px-4 translate-y-full group-hover:translate-y-0 transition-transform">
                                    <button className="w-full py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Silk Evening Gown
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">
                                    Luxury Collection
                                </p>
                                <div className="flex items-center">
                                    <p className="font-medium text-gray-900">
                                        $299.00
                                    </p>
                                    <p className="text-sm text-gray-500 line-through ml-2">
                                        $359.00
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-4 h-4 text-yellow-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                    (42 reviews)
                                </span>
                            </div>
                        </div>

                        <div className="group">
                            <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
                                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    NEW
                                </span>
                                <img
                                    src="/placeholder.svg?height=400&width=300"
                                    alt="Lace Wedding Dress"
                                    className="w-full h-[350px] object-cover object-center"
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white rounded-full text-gray-900 hover:text-pink-500">
                                        <Heart size={20} />
                                    </button>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-white py-4 px-4 translate-y-full group-hover:translate-y-0 transition-transform">
                                    <button className="w-full py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Lace Wedding Dress
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">
                                    Bridal Collection
                                </p>
                                <p className="font-medium text-gray-900">
                                    $1,299.00
                                </p>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-4 h-4 text-yellow-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                    (28 reviews)
                                </span>
                            </div>
                        </div>

                        <div className="group">
                            <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
                                <img
                                    src="/placeholder.svg?height=400&width=300"
                                    alt="Cocktail Dress"
                                    className="w-full h-[350px] object-cover object-center"
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white rounded-full text-gray-900 hover:text-pink-500">
                                        <Heart size={20} />
                                    </button>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-white py-4 px-4 translate-y-full group-hover:translate-y-0 transition-transform">
                                    <button className="w-full py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Cocktail Dress
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">
                                    Evening Collection
                                </p>
                                <p className="font-medium text-gray-900">
                                    $179.00
                                </p>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex">
                                    {[...Array(4)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-4 h-4 text-yellow-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                    <svg
                                        className="w-4 h-4 text-gray-300"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                    (36 reviews)
                                </span>
                            </div>
                        </div>

                        <div className="group">
                            <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100">
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    SALE
                                </span>
                                <img
                                    src="/placeholder.svg?height=400&width=300"
                                    alt="Designer Handbag"
                                    className="w-full h-[350px] object-cover object-center"
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white rounded-full text-gray-900 hover:text-pink-500">
                                        <Heart size={20} />
                                    </button>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-white py-4 px-4 translate-y-full group-hover:translate-y-0 transition-transform">
                                    <button className="w-full py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Designer Handbag
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">Accessories</p>
                                <div className="flex items-center">
                                    <p className="font-medium text-gray-900">
                                        $199.00
                                    </p>
                                    <p className="text-sm text-gray-500 line-through ml-2">
                                        $249.00
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-4 h-4 text-yellow-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                    (52 reviews)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                <Truck className="h-6 w-6 text-gray-900" />
                            </div>
                            <h3 className="font-medium mb-2">Free Shipping</h3>
                            <p className="text-sm text-gray-500">
                                On all orders over $100
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                <RefreshCw className="h-6 w-6 text-gray-900" />
                            </div>
                            <h3 className="font-medium mb-2">Easy Returns</h3>
                            <p className="text-sm text-gray-500">
                                30-day return policy
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                <ShieldCheck className="h-6 w-6 text-gray-900" />
                            </div>
                            <h3 className="font-medium mb-2">
                                Secure Checkout
                            </h3>
                            <p className="text-sm text-gray-500">
                                100% protected payments
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                <CreditCard className="h-6 w-6 text-gray-900" />
                            </div>
                            <h3 className="font-medium mb-2">
                                Multiple Payment Options
                            </h3>
                            <p className="text-sm text-gray-500">
                                Credit cards, PayPal, and more
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-pink-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl  font-bold mb-4">
                            Join Our Community
                        </h2>
                        <p className="text-gray-700 mb-8">
                            Subscribe to our newsletter to receive updates on
                            new collections, exclusive offers, and styling tips.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            By subscribing, you agree to our Privacy Policy and
                            consent to receive updates from our company.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl  font-bold text-center mb-4">
                        Follow Us on Instagram
                    </h2>
                    <p className="text-gray-700 text-center mb-8">
                        @elegance_fashion
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <a
                                href="#"
                                key={i}
                                className="group relative overflow-hidden rounded-lg"
                            >
                                <img
                                    src={`/placeholder.svg?height=300&width=300&text=Instagram+${
                                        i + 1
                                    }`}
                                    alt={`Instagram post ${i + 1}`}
                                    className="w-full h-full object-cover aspect-square"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Heart size={24} className="text-white" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl  font-bold mb-4">
                                ELEGANCE
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Elegance is a premium fashion brand specializing
                                in women's fashion and bridal wear.
                            </p>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                                Shop
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Women's Fashion
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Bridal Collection
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Accessories
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        New Arrivals
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Sale
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                                Customer Service
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Shipping & Returns
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        FAQs
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Size Guide
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Track Order
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                                Account
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        My Account
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Wishlist
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Order History
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Shopping Cart
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Gift Cards
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-gray-400">
                                &copy; {new Date().getFullYear()} Elegance
                                Fashion. All rights reserved.
                            </p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <a
                                    href="#"
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#"
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    Terms of Service
                                </a>
                                <a
                                    href="#"
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    Shipping Policy
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

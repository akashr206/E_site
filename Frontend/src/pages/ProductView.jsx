import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductView = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAdding, setIsAdding] = useState(false); // Buffer state
    const [added, setAdded] = useState(false); // Added state

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`http://localhost:5000/api/products/one/${id}`);
                const data = await response.json();
                setProduct(data);

                if (data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
                if (data.images.length > 0) {
                    setSelectedImage(data.images[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {

        if (!selectedVariant) return;
        setIsAdding(true);
        setAdded(false);

        const response = await fetch('http://localhost:5000/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: id,
                name: product.name,
                images: product.images,
                price: product.price,
                quantity: 1,
                color: selectedVariant.color,
                size: selectedVariant.size
            }),
            credentials: 'include'
        });

        
        setIsAdding(false);
        setAdded(true);

        // Reset "Added" status after 2 seconds
        setTimeout(() => setAdded(false), 2000);


    };

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="bg-white">
            <div className="pt-6">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                        {/* Images */}
                        <div>
                            <div className="lg:col-span-2 p-1">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        src={selectedImage}
                                        alt={product.name}
                                        className="rounded-lg w-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </AnimatePresence>
                            </div>
                            <div className="flex p-1 overflow-x-scroll space-x-2">
                                {product.images.map((url, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedImage(url)}
                                        className={`shrink-0 p-1 border ${selectedImage === url ? 'border-indigo-500' : 'border-gray-300'
                                            } rounded-sm w-24 sm:w-28`}
                                    >
                                        <img className="w-full h-auto sm:h-14 object-cover" src={url} alt="" />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div>
                            <motion.h1
                                className="text-2xl font-bold tracking-tight text-gray-900"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {product.name}
                            </motion.h1>
                            <motion.p
                                className="text-gray-500 mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            >
                                Material: {product.material}
                            </motion.p>
                            <motion.p
                                className="text-xl font-semibold text-indigo-600 mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            >
                                ₹{product.price}
                            </motion.p>

                            {/* Variants */}
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900">Variants</h3>
                                <div className="mt-2">
                                    {product.variants.map((variant, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`p-2 border ${selectedVariant === variant ? 'border-indigo-500' : 'border-gray-300'
                                                } rounded-md mr-2`}
                                        >
                                            {variant.color} - {variant.size}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Variant Details */}
                            {selectedVariant && (
                                <motion.div
                                    className="mt-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p>
                                        <span className="font-medium">Color:</span> {selectedVariant.color}
                                    </p>
                                    <p>
                                        <span className="font-medium">Size:</span> {selectedVariant.size}
                                    </p>
                                </motion.div>
                            )}

                            {/* Add to Cart Button */}
                            <motion.button
                                onClick={handleAddToCart}
                                className={`mt-6 w-full py-2 rounded-md text-white ${isAdding
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : added
                                        ? 'bg-green-500'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                                disabled={isAdding}
                                whileHover={!isAdding && !added ? { scale: 1.02 } : undefined}
                                whileTap={!isAdding && !added ? { scale: 0.98 } : undefined}
                            >
                                {isAdding ? 'Adding...' : added ? 'Added to Cart' : 'Add to Cart'}
                            </motion.button>
                        </div>
                    </div>

                    {/* Product Description */}
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h3 className="text-lg font-medium text-gray-900">Description</h3>
                        <p className="mt-2 text-gray-600">{product.description}</p>
                    </motion.div>

                    {/* Highlights */}
                    {product.tags.length > 0 && (
                        <motion.div
                            className="mt-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {product.tags.map((tag, index) => (
                                    <li
                                        key={index}
                                        className="text-sm bg-gray-200 px-3 py-1 rounded-full"
                                    >
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductView;

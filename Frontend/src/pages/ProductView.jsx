import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../components/Loading';
import Prompt from '../components/ui/Prompt';
import { API_URL } from '../config/api';
import { useAuth } from '../Contexts/AuthContext';

const ProductView = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [colors, setColors] = useState(null)
    const [sizes, setSizes] = useState([" "])
    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [added, setAdded] = useState(false);
    const [error, setError] = useState(false);
    const { user } = useAuth()
    const [prompt, setPrompt] = useState(false)

    function handleSelectColor(color){
        setSelectedColor(color)
    }

    useEffect(() => {
        if (colors) {
            let selected = colors.find(c => Object.keys(c)[0] === selectedColor)
            console.log(selected[selectedColor]);
            setSizes(selected[selectedColor])
            setSelectedSize(selected[selectedColor][0])
        }
    }, [selectedColor])
    

    function fetchSizes(product) {
        const varies = product.variants;
        const colors = {};
        varies.forEach(vary => {
            let color = vary.color.toLowerCase();
            const size = vary.size;
            const stock = vary.stock;

            color = color.charAt(0).toUpperCase() + color.slice(1);
            if (!colors[color]) {
                colors[color] = new Set();
            }
    
            if (stock > 0) {
                colors[color].add(size);
            }
        });
    
        const formattedColors = Object.keys(colors).map(color => {
            return { [color]: Array.from(colors[color]) };
        });
    
        // console.log('Formatted Colors:', formattedColors);
        setColors(formattedColors);
        setSelectedColor(Object.keys(formattedColors[0])[0]);
    }
    


    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`${API_URL}/api/products/one/${id}`);
                if (response.status === 200) {
                    const data = await response.json();
                    setProduct(data)
                    if (data.variants?.length > 0) {
                        fetchSizes(data)
                        setSelectedVariant(data.variants[0]);
                        
                    }
                    if (data.images?.length > 0) {
                        setSelectedImage(data.images[0]);
                    }
                } else {
                    setError(true)
                }

            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            setPrompt(true)
            return
        }

        if (!selectedColor && !selectedSize) return;
        setIsAdding(true);
        setAdded(false);

        const response = await fetch(`${API_URL}/api/cart/add`, {
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
                color: selectedColor,
                size: selectedSize
            }),
            credentials: 'include'
        });

        setIsAdding(false);

        if (response.status === 201) {
            setAdded(true);
            setTimeout(() => setAdded(false), 1000);
        }
        if (response.status === 200) {
            setIsUpdated(true);
            setTimeout(() => setIsUpdated(false), 1000);
        }
    };

    
    if (error) {
        return (
            <h1>"There was an error Finding the Product"</h1>
        )
    }

    if (!product) {
        return <Loading></Loading>;
    }

    if (!error) return (
        <div className="bg-white">
            {prompt && (
                <Prompt
                    title="Login Required"
                    text="You need to log in to add items to your cart"
                    to="login"
                    toValue="Login"
                    close={() => setPrompt(false)}
                />
            )}
            <div className="pt-6">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                        <div>
                            <div className="lg:col-span flex items-center justify-center h-[420px] p-1">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        src={selectedImage}
                                        alt={product.name}
                                        className=" object-cover h-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </AnimatePresence>
                            </div>
                            <div className="flex p-1  sm:justify-center lg:justify-center overflow-x-scroll space-x-2">
                                {product.images.map((url, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedImage(url)}
                                        className={`shrink-0 flex items-center justify-center p-1 border ${selectedImage === url ? 'border-indigo-500' : 'border-gray-300'
                                            } rounded-sm w-16 h-16 sm:w-20 sm:h-20`}
                                    >
                                        <img className="h-full object-cover" src={url} alt="" />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

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
                                ₹{product.price}.00
                            </motion.p>

                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900">Variants</h3>
                                <div className="mt-2">
                                    <div className="font-medium my-3">Color : {selectedColor}</div>
                                    {colors.map((color, index) => (
                                        
                                        
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSelectColor(Object.keys(color)[0])}
                                            className={`p-2 border ${selectedColor === Object.keys(color)[0] ? 'bg-indigo-500 text-white' : 'border-gray-300'
                                                } rounded-sm mr-2`}
                                        >
                                            {Object.keys(color)[0]}
                                        </motion.button>
                                    ))}
                                    <div className="font-medium my-3">Size : {selectedSize}</div>
                                    {sizes.map((size, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedSize(size)}
                                            className={`p-2 border ${selectedSize === size ? 'bg-indigo-500 text-white' : 'border-gray-300'
                                                } rounded-sm mr-2`}
                                        >
                                            {size}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                onClick={handleAddToCart}
                                className={`mt-6 w-full py-2 rounded-md text-white ${isAdding
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : added || isUpdated
                                        ? 'bg-green-500'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                                disabled={isAdding}
                                whileHover={!isAdding && !added ? { scale: 1.02 } : undefined}
                                whileTap={!isAdding && !added ? { scale: 0.98 } : undefined}
                            >
                                {isAdding ? 'Adding...' : added ? 'Added to Cart' : isUpdated ? 'Updated the Cart' : 'Add to Cart'}
                            </motion.button>
                        </div>
                    </div>

                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h3 className="text-lg font-medium text-gray-900">Description</h3>
                        <p className="mt-2 text-gray-600">{product.description}</p>
                    </motion.div>

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

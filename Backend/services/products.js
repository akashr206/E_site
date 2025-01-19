const { find } = require('../models/CartItem');
const Products = require('../models/Product');

const createProduct = async (product) => {
    const newProduct = await Products.create(product);
    return newProduct;
};

const findAllProducts = async () => {
    const products = await Products.find({});
    return products;
};

const updateProduct = async (id, updateItem) => {
    const updatedProduct = await Products.updateOne({id}, updateItem);
    return updatedProduct;
};

const findProductById = async (id) => {
    const product = await Products.findOne({id : id});
    if (!product) {
        return null
    }
    return product;
};

const deleteProduct = async (id) => {
    const deletedProduct = await Products.deleteOne({id});
    if (!deletedProduct) {
        throw new Error('Product not found');
    }
    return deletedProduct;
};

const countProducts = async () => {
    const count = await Products.countDocuments();
    return count;
};

const findStock = async (id, color, size) => {
    const product = await Products.findOne({id : id});
    if (!product) {
        throw new Error('Product not found');
    }
    const variant = product.variants.find(v => v.color === color && v.size === size);
    if (!variant) {
        throw new Error('Variant not found');
    }
    return variant.stock;
};

module.exports = { 
    createProduct, 
    findAllProducts, 
    updateProduct, 
    findProductById, 
    deleteProduct,
    countProducts,
    findStock
};

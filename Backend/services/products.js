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
        throw new Error('Product not found');
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

module.exports = { 
    createProduct, 
    findAllProducts, 
    updateProduct, 
    findProductById, 
    deleteProduct,
    countProducts 
};

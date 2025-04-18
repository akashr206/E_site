const { find } = require("../models/CartItem");
const Products = require("../models/Product");
const cloudinary = require("cloudinary").v2;

const createProduct = async (product) => {
    const newProduct = await Products.create(product);
    return newProduct;
};

const findAllProducts = async (page, limit) => {
    const products = await Products.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    return products;
};

const updateProduct = async (id, updateItem) => {
    const updatedProduct = await Products.updateOne({ id }, updateItem);
    return updatedProduct;
};

const findProductById = async (id) => {
    const product = await Products.findOne({ id: id });
    if (!product) {
        return null;
    }
    return product;
};

const deleteProduct = async (id, publicIds) => {
    const deletedProduct = await Products.deleteOne({ id });
    await Promise.all(
        publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    if (!deletedProduct) {
        throw new Error("Product not found");
    }
    return deletedProduct;
};

const countProducts = async () => {
    const count = await Products.countDocuments();
    return count;
};

const findStock = async (id, color, size) => {
    const product = await Products.findOne({ id: id });
    if (!product) {
        throw new Error("Product not found");
    }
    const variant = product.variants.find(
        (v) =>
            v.color.toLocaleLowerCase() === color.toLocaleLowerCase() &&
            v.size.toLocaleLowerCase() === size.toLocaleLowerCase()
    );
    if (!variant) {
        throw new Error("Variant not found");
    }
    return variant.stock;
};

const reduceStock = async (productId, reduceNumber, color, size) => {
    try {
        const product = await Products.findOne({ id: productId });
        if (!product?.name) {
            return { message: "Product is unavailable" };
        }
        const variant = product.variants.find(
            (vari) =>
                vari.color.toLocaleLowerCase() === color.toLocaleLowerCase() ||
                vari.size.toLocaleLowerCase() === size.toLocaleLowerCase()
        );
        variant.stock = Math.max(parseInt(variant.stock, 10) - reduceNumber, 0);
        product.variants[variant] = variant;
        await product.save();

        return { success: true, message: "Stock reduced", product };
    } catch (error) {
        console.log(error);

        console.error("Error reducing stock:", error.message);
        return { success: false, message: error.message };
    }
};

module.exports = {
    createProduct,
    findAllProducts,
    updateProduct,
    findProductById,
    deleteProduct,
    countProducts,
    findStock,
    reduceStock,
};

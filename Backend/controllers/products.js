const {
    createProduct,
    findAllProducts,
    updateProduct,
    findProductById,
    deleteProduct,
    countProducts,
    findStock,
    findLowStock,
} = require("../services/products");
const { generateId } = require("../utils/generateId");
const Product = require("../models/Product");

const AddProduct = async (req, res) => {
    try {
        let {
            name,
            price,
            mrp,
            category,
            material,
            description,
            tags,
            variants,
            images,
        } = req.body;

        const id = await generateId(10);

        const product = {
            id,
            name,
            price,
            mrp,
            category,
            material,
            description,
            tags,
            variants,
            images: images.map((e) => e.url),
            imageIds: images.map((e) => e.public_id),
        };

        await createProduct(product);
        res.json({ message: "Succesfully added the product" });
    } catch (err) {
        res.status(500).json({ error: `Error adding Product ${err}` });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const products = await findAllProducts(page, limit);
        const totalProducts = await countProducts();
        res.json({
            products,
            pagination: {
                totalProducts,
                limit: limit,
                page: page,
                totalPages: Math.ceil(totalProducts / limit),
            },
        });
    } catch (error) {
        res.status(400).json({ message: "Error Fetching Products", error });
    }
};

const getNewProducts = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 45;

        const products = await findAllProducts(page, limit);
        const totalProducts = await countProducts();
        res.json({
            products,
            pagination: {
                totalProducts,
                limit: limit,
                page: page,
                totalPages: Math.ceil(totalProducts / limit),
            },
        });
    } catch (error) {
        res.status(400).json({ message: "Error Fetching Products", error });
    }
};

const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const updateItem = req.body;
        await updateProduct(id, updateItem);
        res.json({ message: "Item Updated successfully" });
    } catch (err) {
        res.status(500).json({ error: `Error Updating product ${err}` });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await findProductById(productId);

        if (product) {
            return res.status(200).json(product);
        } else {
            return res
                .status(204)
                .json({ message: "No such Product is found" });
        }
    } catch (error) {
        res.status(204).json({
            message: "error fetching the product",
            error: error,
        });
    }
};

const removeProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { publicIds } = req.body;
        if (!publicIds) {
            res.status(400).json({ message: "Image IDs are required." });
        }
        await deleteProduct(productId, publicIds);
        res.status(200).json({ message: "Successfully Removed the product" });
    } catch (error) {
        res.json({ message: "error removing the product", error: error });
    }
};

const getCount = async (req, res) => {
    const count = await countProducts();
    res.status(200).json({ count });
};

const getStock = async (req, res) => {
    try {
        const id = req.params.id;
        const { color, size } = req.query;
        const stock = await findStock(id, color, size);
        res.status(200).json({ stock });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "error fetching the stock",
            error: error,
        });
    }
};

const getLowStock = async (req, res) => {
    try {
        const products = await findLowStock();
        return res.json({ products });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTotalProducts = async (req, res) => {
    try {
        const monthlyProducts = await Product.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 },
            },
        ]);

        const totalProducts = await countProducts();
        return res.status(200).json({ totalProducts, monthlyProducts });
    } catch (error) {
        console.error("Error getting total products:", error);
        return res.status(500).json({ error: "Failed to get total products" });
    }
};

module.exports = {
    AddProduct,
    getAllProducts,
    editProduct,
    getProductById,
    removeProduct,
    getCount,
    getStock,
    getLowStock,
    getTotalProducts,
    getNewProducts,
};

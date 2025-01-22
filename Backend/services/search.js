const Products = require('../models/Product')


const findProducts = async (query) => {
    const searchedProducts = await Products.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    return searchedProducts
}

module.exports = { findProducts }
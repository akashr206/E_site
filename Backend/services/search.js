const Products = require('../models/Product')

const findProducts = async (query)=>{
    const searchedProducts = await Products.find(
        {
            $or: [
                { name: { $regex: query, $options: "i" } },
                { tags: { $regex: query, $options: "i" } }
            ]
        }
    );
    return searchedProducts
}

module.exports = {findProducts}
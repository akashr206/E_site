const {findProducts} = require('../services/search')

const searchProducts = async (req,res)=>{
    const {query} = req.query
    const searchedProducts = await findProducts(query)
    res.status(200).json(searchedProducts)
}

module.exports = {searchProducts}

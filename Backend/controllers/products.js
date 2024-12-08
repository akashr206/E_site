const { createProduct, findAllProducts, updateProduct, findProductById, deleteProduct, countProducts, findStock } = require('../services/products')
const { v4: uuidv4 } = require('uuid')

const AddProduct = async (req, res) => {
    try {
        const {
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

        const id = uuidv4();
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
            images
        };
        const addedProduct = await createProduct(product)
        res.json({message : 'Succesfully added the product', ...addedProduct })
    } catch (err) {
        res.json({error : `Error adding Product ${err}`})
    }
}

const getAllProducts = async (req,res) => {
    try {
        const products = await findAllProducts()
        res.json(products)
    } catch (error) {
        res.status(400).json({message: 'Error Fetching Products', error })
    }
}

const editProduct = async (req,res) => {
    try {
        const id = req.params.id
        const updateItem = req.body
        await updateProduct(id,updateItem)
        res.json({message : 'Item Updated successfully'})
    } catch (err) {
        res.json({error : `Error Updating product ${err}`})
    }
}

const getProductById = async (req,res) => {
    try {
        const productId = req.params.id
        const product = await findProductById(productId)
        
        if(product){
            return res.status(200).json(product)
        } else {
            return res.status(204).json({message : 'No such Product is found'})
        }
        
    } catch (error) {
        res.json({message : 'error fetching the product', error: error})
    }
}

const removeProduct = async (req,res) => {
    try {
        const productId = req.params.id
        await deleteProduct(productId)
        res.status(200).json({message : 'Successfully Removed the product'})
    } catch (error) {
        res.json({message : 'error removing the product', error: error})
    }
}

const getCount = async (req,res) => {
    const count = await countProducts() 
    res.status(200).json({count})
}

const getStock = async (req,res) => {
    try {
        const id = req.params.id
        const {color , size} = req.query
        const stock = await findStock(id, color, size)
        res.status(200).json({stock})
        
    } catch (error) {  
        console.log(error);
        res.json({message : 'error fetching the stock', error: error})
    }

}

module.exports = { AddProduct, getAllProducts, editProduct, getProductById, removeProduct, getCount, getStock}
  
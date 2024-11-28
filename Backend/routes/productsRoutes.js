const { AddProduct, getAllProducts, editProduct, getProductById, removeProduct, getCount } = require('../controllers/products')
const router = require('express').Router()

//customer requests
router.get('/one/:id', getProductById)
router.get('/all', getAllProducts)
router.get('/count', getCount)

//admin requests
router.post('/add', AddProduct)
router.put('/update/:id', editProduct)
router.delete('/delete/:id', removeProduct)

module.exports = router
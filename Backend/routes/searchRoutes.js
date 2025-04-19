const {  searchProducts } = require('../controllers/search')
const router = require('express').Router()

//user
router.get('/', searchProducts)

module.exports = router
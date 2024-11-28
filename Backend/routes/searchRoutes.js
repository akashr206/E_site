const {  searchProducts } = require('../controllers/search')
const router = require('express').Router()

//customer requests
router.get('/', searchProducts)

module.exports = router
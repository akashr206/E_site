const {
    AddProduct,
    getStock,
    getAllProducts,
    editProduct,
    getProductById,
    removeProduct,
    getCount,
    getLowStock,
    getTotalProducts
} = require("../controllers/products");
const router = require("express").Router();

//user
router.get("/one/:id", getProductById);
router.get("/all", getAllProducts);
router.get("/stock/:id", getStock);

//admin requests
router.post("/add", AddProduct);
router.get("/count", getCount);
router.get("/total", getTotalProducts);
router.put("/update/:id", editProduct);
router.delete("/delete/:id", removeProduct);
router.get("/low", getLowStock);

module.exports = router;

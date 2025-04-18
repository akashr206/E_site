const {
    AddProduct,
    getStock,
    getAllProducts,
    editProduct,
    getProductById,
    removeProduct,
    getCount,
    getLowStock,
} = require("../controllers/products");
const router = require("express").Router();

//customer requests
router.get("/one/:id", getProductById);
router.get("/all", getAllProducts);
router.get("/stock/:id", getStock);

//admin requests
router.post("/add", AddProduct);
router.get("/count", getCount);
router.put("/update/:id", editProduct);
router.delete("/delete/:id", removeProduct);
router.get("/low", getLowStock);

module.exports = router;

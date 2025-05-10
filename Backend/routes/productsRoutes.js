const {
    AddProduct,
    getStock,
    getAllProducts,
    editProduct,
    getProductById,
    removeProduct,
    getCount,
    getLowStock,
    getTotalProducts,
} = require("../controllers/products");
const router = require("express").Router();
const isAdmin = require("../middlewares/isAdmin");
const isAuthenticated = require("../middlewares/auth");

//user
router.get("/one/:id", getProductById);
router.get("/all", getAllProducts);
router.get("/stock/:id", getStock);

//admin requests
router.post("/add", isAuthenticated, isAdmin, AddProduct);
router.get("/count", isAuthenticated, isAdmin, getCount);
router.get("/total", isAuthenticated, isAdmin, getTotalProducts);
router.put("/update/:id", isAuthenticated, isAdmin, editProduct);
router.delete("/delete/:id", isAuthenticated, isAdmin, removeProduct);
router.get("/low", isAuthenticated, isAdmin, getLowStock);

module.exports = router;

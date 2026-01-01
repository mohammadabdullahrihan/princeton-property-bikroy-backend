const express = require("express")
const { authMiddleware } = require("../middleware/auth")
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/buildingProductController")

const router = express.Router()

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", authMiddleware, createProduct)
router.put("/:id", authMiddleware, updateProduct)
router.delete("/:id", authMiddleware, deleteProduct)

module.exports = router

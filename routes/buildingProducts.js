const express = require("express")
const { authenticate } = require("../middleware/auth")
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
router.post("/", authenticate, createProduct)
router.put("/:id", authenticate, updateProduct)
router.delete("/:id", authenticate, deleteProduct)

module.exports = router

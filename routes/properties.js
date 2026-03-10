const express = require("express");
const upload = require("../config/multer");
const { authenticate, authorize } = require("../middleware/auth");
const { validateProperty } = require("../middleware/validation");
const propertyController = require("../controllers/propertyController");

const router = express.Router();

router.get("/", propertyController.getAllProperties);
router.get("/featured", propertyController.getFeaturedProperties);
router.get("/similar/:id", propertyController.getSimilarProperties);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.array("images", 10),
  validateProperty,
  propertyController.createProperty,
);
router.get("/:id", propertyController.getPropertyById);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.array("images", 10),
  propertyController.updateProperty,
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  propertyController.deleteProperty,
);

module.exports = router;

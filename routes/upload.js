const express = require("express");
const upload = require("../config/multer");
const { authenticate } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

const router = express.Router();

/**
 * @desc    Upload an image
 * @route   POST /api/upload
 * @access  Private
 */
router.post(
  "/",
  authenticate,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
      },
      message: "আপলোড সফল",
    });
  }),
);

module.exports = router;

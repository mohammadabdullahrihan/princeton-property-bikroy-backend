const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Local Storage Setup
const uploadDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// Cloudinary Storage Setup (Ready to use)
let storage = localStorage;

// To enable Google Cloud Storage, set IMAGE_STORAGE_TYPE=google in .env
if (process.env.IMAGE_STORAGE_TYPE === 'google') {
  try {
    storage = require('./googleCloud');
    console.log("☁️  Using Google Cloud Storage for image storage");
  } catch (err) {
    console.error("❌ Failed to load Google Cloud storage, falling back to local:", err.message);
  }
}

// To enable Cloudinary, set IMAGE_STORAGE_TYPE=cloudinary in .env 
else if (process.env.IMAGE_STORAGE_TYPE === 'cloudinary') {
  try {
    const { storage: cloudinaryStorage } = require('./cloudinary');
    storage = cloudinaryStorage;
    console.log("☁️  Using Cloudinary for image storage");
  } catch (err) {
    console.error("❌ Failed to load Cloudinary storage, falling back to local:", err.message);
  }
}

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("অনুমোদিত নয় এমন ফাইল টাইপ"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

module.exports = upload

const { Storage } = require('@google-cloud/storage');
const GoogleCloudStorage = require('multer-cloud-storage').default;
const path = require('path');

// GCS Configuration
// This requires GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_KEY_FILE (path to JSON), and GOOGLE_CLOUD_BUCKET_NAME
const storage = new GoogleCloudStorage({
  bucket: process.env.GOOGLE_CLOUD_BUCKET_NAME,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to your service account JSON file
  destination: 'properties/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

module.exports = storage;

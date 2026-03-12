const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Import middleware
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Initialize express app
const app = express();

/**
 * ===== MIDDLEWARE =====
 */

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://princetondevelopmentltdproperties.netlify.app",
  "https://properties.princetondevelopmentltd.com",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitize data to prevent MongoDB injection
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * ===== DYNAMIC ROUTE LOADING =====
 */

const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(path.join(routesPath, file));
    // Determine the route prefix based on filename
    // Convert camelCase to kebab-case (e.g., savedListings.js -> saved-listings)
    let routeName = file
      .replace("Routes.js", "")
      .replace(".js", "")
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();

    // Custom mapping for consistency
    if (routeName === "super-admin") routeName = "superadmin";

    app.use(`/api/${routeName}`, route);
    console.log(`📡 Route Loaded: /api/${routeName}`);
  }
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Princeton Property Bikroy API (Dynamic Engine)",
    version: "2.0.0",
  });
});

/**
 * ===== ERROR HANDLING =====
 */
app.use(notFound);
app.use(errorHandler);

/**
 * ===== SERVER & DATABASE =====
 */
const PORT = process.env.PORT || 5000;

// -----------------------------------------------------------------------
// Serverless-safe MongoDB connection with caching.
// On Vercel, each cold-start imports this module fresh, but subsequent
// invocations reuse the same Node process, so we cache the connection
// promise to avoid opening multiple connections.
// -----------------------------------------------------------------------
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) return cachedConnection;

  // If mongoose already has an open connection (e.g. warm Lambda),
  // reuse it instead of calling connect() again.
  if (mongoose.connection.readyState >= 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    // Recommended settings for serverless environments
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  cachedConnection = conn.connection;
  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  return cachedConnection;
};

// Connect immediately so MongoDB is ready before the first request hits
// (works for both traditional servers AND Vercel serverless functions).
connectDB().catch((err) => {
  console.error(`❌ MongoDB Connection Error: ${err.message}`);
  // Don't call process.exit in serverless — it would crash the whole runtime.
  if (require.main === module) process.exit(1);
});

// Traditional server start (local dev / non-serverless hosting)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `\n🚀 Server running in ${process.env.NODE_ENV || "development"} mode`,
    );
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`\n✨ System is Dynamic & Ready!\n`);
  });
}

module.exports = app;

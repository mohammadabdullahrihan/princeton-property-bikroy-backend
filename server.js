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
    // e.g., authRoutes.js -> /api/auth, properties.js -> /api/properties
    let routeName = file
      .replace("Routes.js", "")
      .replace(".js", "")
      .toLowerCase();

    // Custom mapping for consistency if needed
    if (routeName === "auth") routeName = "auth";

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

const startServer = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    app.listen(PORT, () => {
      console.log(
        `\n🚀 Server running in ${process.env.NODE_ENV || "development"} mode`,
      );
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`\n✨ System is Dynamic & Ready!\n`);
    });
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;

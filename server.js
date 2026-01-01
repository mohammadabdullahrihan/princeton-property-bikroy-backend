const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const path = require("path")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const morgan = require("morgan")
const http = require("http")
const socketIo = require("socket.io")
const csrf = require("csurf")
const cookieParser = require("cookie-parser")

const authRoutes = require("./routes/auth")
const propertyRoutes = require("./routes/properties")
const buildingProductRoutes = require("./routes/buildingProducts")
const locationRoutes = require("./routes/locations")
const savedListingRoutes = require("./routes/savedListings")
const messageRoutes = require("./routes/messages")
const userRoutes = require("./routes/users")
const adminRoutes = require("./routes/admin")
const { errorHandler } = require("./middleware/errorHandler")

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : ["http://localhost:3000"],
    credentials: true,
  },
})

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
)
app.use(morgan("combined"))
app.use(mongoSanitize())
app.use(cookieParser())

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL || "https://yourdomain.com"
      : ["http://localhost:3000", "http://localhost:5000"],
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "অনেক লগইন প্রচেষ্টা হয়েছে, পরে চেষ্টা করুন",
})

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "অনেক অনুরোধ পাঠানো হয়েছে, পরে চেষ্টা করুন",
})

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// CSRF protection for mutating endpoints
const csrfProtection = csrf({ cookie: true })

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/property-bikroy", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err))

// Socket.io for real-time messaging
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-conversation", (conversationId) => {
    socket.join(`conversation-${conversationId}`)
  })

  socket.on("send-message", (data) => {
    io.to(`conversation-${data.conversationId}`).emit("new-message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// CSRF token endpoint
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// Routes with rate limiting
app.use("/api/auth", authLimiter, authRoutes)
app.use("/api/properties", apiLimiter, csrfProtection, propertyRoutes)
app.use("/api/building-products", apiLimiter, csrfProtection, buildingProductRoutes)
app.use("/api/locations", locationRoutes)
app.use("/api/saved-listings", apiLimiter, csrfProtection, savedListingRoutes)
app.use("/api/messages", apiLimiter, csrfProtection, messageRoutes)
app.use("/api/users", apiLimiter, csrfProtection, userRoutes)
app.use("/api/admin", apiLimiter, csrfProtection, adminRoutes)

// Error Handling
app.use(errorHandler)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ code: "NOT_FOUND", message: "Route not found" })
})

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || "development"
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${NODE_ENV})`)
})

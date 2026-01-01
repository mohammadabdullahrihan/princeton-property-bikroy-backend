const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ code: "NO_TOKEN", message: "টোকেন প্রয়োজন" })
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error("JWT_SECRET not configured")
    }
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ code: "INVALID_TOKEN", message: "অবৈধ টোকেন" })
  }
}

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ code: "FORBIDDEN", message: "প্রশাসক অনুমতি প্রয়োজন" })
  }
  next()
}

module.exports = { authMiddleware, adminMiddleware }

const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err)

  const status = err.status || err.statusCode || 500
  const code = err.code || "INTERNAL_ERROR"

  let message = err.message || "সার্ভার ত্রুটি"

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: messages.join(", "),
    })
  }

  // Mongoose cast errors
  if (err.name === "CastError") {
    return res.status(400).json({
      code: "CAST_ERROR",
      message: "Invalid ID format",
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(400).json({
      code: "DUPLICATE_FIELD",
      message: `${field} ইতিমধ্যে ব্যবহৃত`,
    })
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === "production") {
    message = status === 500 ? "সার্ভার ত্রুটি" : message
  }

  res.status(status).json({ code, message })
}

module.exports = { errorHandler }

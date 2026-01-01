const express = require("express")
const { authMiddleware } = require("../middleware/auth")
const { sendMessage, getInbox, getConversation, markMessageAsRead } = require("../controllers/messageController")

const router = express.Router()

router.post("/", authMiddleware, sendMessage)
router.get("/inbox", authMiddleware, getInbox)
router.get("/conversation", authMiddleware, getConversation)
router.put("/:messageId/read", authMiddleware, markMessageAsRead)

module.exports = router

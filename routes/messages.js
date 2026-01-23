const express = require("express")
const { authenticate } = require("../middleware/auth")
const { sendMessage, getInbox, getConversation, markMessageAsRead } = require("../controllers/messageController")

const router = express.Router()

router.post("/", authenticate, sendMessage)
router.get("/inbox", authenticate, getInbox)
router.get("/conversation", authenticate, getConversation)
router.put("/:messageId/read", authenticate, markMessageAsRead)

module.exports = router

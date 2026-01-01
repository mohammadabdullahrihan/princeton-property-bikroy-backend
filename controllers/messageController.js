const Message = require("../models/Message")

const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, propertyId, message } = req.body

    const newMessage = new Message({
      senderId: req.user.id,
      receiverId,
      propertyId,
      message,
    })

    await newMessage.save()

    await newMessage.populate("senderId", "name email profileImage")

    res.status(201).json({
      code: "MESSAGE_SENT",
      message: "বার্তা পাঠানো সফল",
      data: newMessage,
    })
  } catch (err) {
    next(err)
  }
}

const getInbox = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const pageNum = Math.max(1, Number.parseInt(page))
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const messages = await Message.find({ receiverId: req.user.id })
      .populate("senderId", "-password -verificationToken -passwordResetToken")
      .populate("propertyId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)

    const total = await Message.countDocuments({ receiverId: req.user.id })

    res.json({
      messages,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (err) {
    next(err)
  }
}

const getConversation = async (req, res, next) => {
  try {
    const { userId, propertyId, page = 1, limit = 50 } = req.query
    const pageNum = Math.max(1, Number.parseInt(page))
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
      propertyId,
    })
      .populate("senderId", "-password -verificationToken -passwordResetToken")
      .populate("receiverId", "-password -verificationToken -passwordResetToken")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limitNum)

    const total = await Message.countDocuments({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
      propertyId,
    })

    res.json({
      messages,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (err) {
    next(err)
  }
}

const markMessageAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params
    const message = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true })

    if (!message) {
      return res.status(404).json({ code: "NOT_FOUND", message: "বার্তা পাওয়া যায়নি" })
    }

    res.json({ code: "MARKED_READ", message: "বার্তা পড়া চিহ্নিত", data: message })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  sendMessage,
  getInbox,
  getConversation,
  markMessageAsRead,
}

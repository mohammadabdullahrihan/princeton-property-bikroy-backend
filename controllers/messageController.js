const BaseController = require("./BaseController");
const Message = require("../models/Message");
const { asyncHandler } = require("../middleware/errorHandler");

class MessageController extends BaseController {
  constructor() {
    super(Message, ["senderId", "receiverId", "propertyId", "message"]);
  }

  /**
   * @desc    Send a message
   * @route   POST /api/messages
   * @access  Private
   */
  sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, propertyId, message } = req.body;

    const newMessage = new Message({
      senderId: req.user.id,
      receiverId,
      propertyId,
      message,
    });

    await newMessage.save();

    await newMessage.populate("senderId", "name email profileImage");

    res.status(201).json({
      success: true,
      data: newMessage,
      message: "বার্তা পাঠানো সফল",
    });
  });

  /**
   * @desc    Get inbox messages
   * @route   GET /api/messages/inbox
   * @access  Private
   */
  getInbox = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, Number.parseInt(page));
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const messages = await Message.find({ receiverId: req.user.id })
      .populate("senderId", "-password -verificationToken -passwordResetToken")
      .populate("propertyId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Message.countDocuments({ receiverId: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
      message: "Inbox retrieved",
    });
  });

  /**
   * @desc    Get conversation between users
   * @route   GET /api/messages/conversation
   * @access  Private
   */
  getConversation = asyncHandler(async (req, res) => {
    const { userId, propertyId, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, Number.parseInt(page));
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
      propertyId,
    })
      .populate("senderId", "-password -verificationToken -passwordResetToken")
      .populate(
        "receiverId",
        "-password -verificationToken -passwordResetToken",
      )
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Message.countDocuments({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
      propertyId,
    });

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
      message: "Conversation retrieved",
    });
  });

  /**
   * @desc    Mark message as read
   * @route   PUT /api/messages/:messageId/read
   * @access  Private
   */
  markMessageAsRead = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true },
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "বার্তা পাওয়া যায়নি",
      });
    }

    res.status(200).json({
      success: true,
      data: message,
      message: "বার্তা পড়া চিহ্নিত",
    });
  });
}

module.exports = new MessageController();

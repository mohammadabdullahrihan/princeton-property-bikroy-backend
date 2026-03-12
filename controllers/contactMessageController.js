const BaseController = require("./BaseController");
const ContactMessage = require("../models/ContactMessage");
const { asyncHandler } = require("../middleware/errorHandler");

class ContactMessageController extends BaseController {
  constructor() {
    super(ContactMessage, ["firstName", "lastName", "email", "phoneNumber", "message"]);
  }

  /**
   * @desc    Send a contact message (Public)
   * @route   POST /api/contact-messages
   * @access  Public
   */
  sendContactMessage = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    const newMessage = await ContactMessage.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
      message: "বার্তা পাঠানো সফল। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
    });
  });

  /**
   * @desc    Get all contact messages (Admin only)
   * @route   GET /api/contact-messages
   * @access  Private/Admin
   */
  getContactMessages = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await ContactMessage.countDocuments();

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
      message: "Contact messages retrieved",
    });
  });

  /**
   * @desc    Mark message as read
   * @route   PUT /api/contact-messages/:id/read
   * @access  Private/Admin
   */
  markAsRead = asyncHandler(async (req, res) => {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      data: message,
      message: "Message marked as read",
    });
  });

  /**
   * @desc    Delete contact message
   * @route   DELETE /api/contact-messages/:id
   * @access  Private/Admin
   */
  deleteMessage = asyncHandler(async (req, res) => {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  });
}

module.exports = new ContactMessageController();

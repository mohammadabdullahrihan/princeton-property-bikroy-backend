const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "ইমেইল যাচাইকরণ - Property Bikroy",
    html: `
      <h2>আপনার ইমেইল যাচাই করুন</h2>
      <p>নিম্নলিখিত লিঙ্কে ক্লিক করে আপনার ইমেইল যাচাই করুন:</p>
      <a href="${verifyUrl}">ইমেইল যাচাই করুন</a>
      <p>এই লিঙ্কটি ২৪ ঘন্টার জন্য বৈধ।</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error("Email send failed:", err)
  }
}

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "পাসওয়ার্ড পুনরায় সেট করুন - Property Bikroy",
    html: `
      <h2>পাসওয়ার্ড পুনরায় সেট করুন</h2>
      <p>নিম্নলিখিত লিঙ্কে ক্লিক করে আপনার পাসওয়ার্ড পুনরায় সেট করুন:</p>
      <a href="${resetUrl}">পাসওয়ার্ড রিসেট করুন</a>
      <p>এই লিঙ্কটি ৩০ মিনিটের জন্য বৈধ।</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error("Email send failed:", err)
  }
}

const sendPropertyStatusEmail = async (email, propertyTitle, status) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `সম্পত্তি ${status === "active" ? "অনুমোদিত" : "প্রত্যাখ্যাত"} - Property Bikroy`,
    html: `
      <h2>সম্পত্তি স্ট্যাটাস আপডেট</h2>
      <p>আপনার সম্পত্তি "${propertyTitle}" ${status === "active" ? "অনুমোদিত" : "প্রত্যাখ্যাত"} হয়েছে।</p>
      <p><a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard">আপনার ড্যাশবোর্ড দেখুন</a></p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.error("Email send failed:", err)
  }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendPropertyStatusEmail }

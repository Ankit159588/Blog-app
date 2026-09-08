import nodemailer from "nodemailer"
import config from "../config/config.js"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.log("Error connecting to mail server", error)
  } else {
    console.log("Email server is ready to send messages")
  }
})

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: config.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
      html: html
    })

    console.log("Email sent:", info.messageId);
    return info

  } catch (error) {
    console.error('Error sending email:', error);
  }
}

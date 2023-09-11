const nodemailer = require('nodemailer');
require('dotenv').config();

const USER = process.env.MAIL_USER;
const PASS = process.env.MAIL_PASSWORD;
const HOST = process.env.MAILHOST;
const PORT = process.env.MAILPORT;
const MAIL = process.env.MAIL_USER;


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host : HOST,
  port: PORT,
  secure: false,
  auth: {
    user: USER,
    pass: PASS,
  },
});

// Function to send an email
const sendEmail = async (req, res) => {
  try {
    const { to, subject, text, attach } = req.body;

    console.log(attach)

    const mailOptions = {
      from: MAIL,
      to,
      subject,
      text,
      
    };

    if (attach) {
      mailOptions.attachments = [{
        filename: "lorem-ipsum.pdf",
        path: "./src/controllers/mail/lorem-ipsum.pdf",
      }];
    }

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(400).json({ message: 'Error sending email' });
  }
};

module.exports = {
  sendEmail
}
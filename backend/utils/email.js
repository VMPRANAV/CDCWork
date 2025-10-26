const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = require('../.config/config');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `"CDC - KPRIET" <${EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

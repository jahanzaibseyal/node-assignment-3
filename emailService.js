const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'seyaljahanzaib@gmail.com',
    pass: '',
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: 'seyaljahanzaib@gmail.com',
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log('Email sent: ' + info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

module.exports = sendEmail;

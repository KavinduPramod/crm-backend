const transporter = require('./emailService.js'); // Import the nodemailer transporter

// Function to send an email with a customizable subject
function sendEmailWithSubject(toEmail, subject, message, callback) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Replace with your email address
    to: toEmail,
    subject: subject, // Customize the subject
    html: message, // Pass the HTML content here
  };

  transporter.sendMail(mailOptions, callback);
}

module.exports = { sendEmailWithSubject };

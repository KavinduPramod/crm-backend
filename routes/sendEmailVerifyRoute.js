// // Importing the email transporter and utility function using require
// const transporter = require("../config/emailService");
// const { sendEmailWithSubject } = require("../config/emailUtils");

// app.post('/send-customer-email', (req, res) => {
//     // Get data from the request body
//     const { recipientEmail, subject, message } = req.body;
  
//     // Call the utility function to send the email
//     sendEmailWithSubject(recipientEmail, subject, message, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ error: 'Error sending email' });
//       } else {
//         console.log('Email sent:', info.response);
//         res.json({ message: 'Email sent Successfully' });
//       }
//     });
//   });
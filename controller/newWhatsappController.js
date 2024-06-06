const { getConnection } = require('../config/db');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendWhatsappMessage = async (req, res) => {
    try {
        const message = await client.messages.create({
            body: req.body.message || "HELLO", // Use provided text or default to "HELLO"
            messagingServiceSid: 'MGd9e3a97c364a381df5026863f5685647',
            to: 'whatsapp:+94758139928', // Ensure this is correct
            from: 'whatsapp:+14155238886'
        });
        console.log(message.sid);
        res.status(200).json({ message: `Message sent with SID: ${message.sid}` });
    } catch (error) {
        throw new Error("Database query failed");
    }
};

module.exports = { sendWhatsappMessage };

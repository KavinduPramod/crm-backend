const express = require('express');
const { sendWhatsappMessage } = require('../controller/newWhatsappController'); //insert_transaction_sms,
const router = express.Router();

router.post('/sendMessage', sendWhatsappMessage);

module.exports = router;
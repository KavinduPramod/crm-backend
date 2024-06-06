const express = require('express');
const { sendSMS, smsCost } = require('../controller/newSMSController'); //insert_transaction_sms,
const router = express.Router();

router.post('/sendSMS', async (req, res) => {
    try {
        const result = await sendSMS(req, res);
        if (result == 0) {
            res.status(404).json({ code: 404, message: 'SMS Not Found!' });
            return;
        }
        res.status(200).json({ code: 200, message: 'Successfully Add SMS' });
    } catch (error) {
        console.error("Error", error);
        res.status(500).send("Can't save transaction SMS");
    }
});

router.post('/smsCost', async (req, res) => {
    try {
        const result = await smsCost(req, res);
        res.status(200).json({ code: 200, message: 'Successfully get cost', cost: result });
    } catch (error) {
        console.error("Error", error);
        res.status(500).send("Can't save transaction SMS");
    }
});
module.exports = router;

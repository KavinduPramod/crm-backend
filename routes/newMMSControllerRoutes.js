const express = require('express');
const { sendMMS, mmsCost } = require('../controller/newMMSController');
const router = express.Router();

router.post('/sendMMS', async (req, res) => {
    try {
        const result = await sendMMS(req, res);
        if (result == 0) {
            res.status(404).json({ code: 404, message: 'MMS Not Found!' });
            return;
        }
        res.status(200).json({ code: 200, message: 'Successfully Add MMS' });
    } catch (error) {
        console.error("Error", error);
        res.status(500).send("Can't save transaction SMS");
    }
});

router.post('/mmsCost', async (req, res) => {
    try {
        const result = await mmsCost(req, res);
        res.status(200).json({ code: 200, message: 'Successfully get cost', cost: result });
    } catch (error) {
        console.error("Error", error);
        res.status(500).send("Can't save transaction SMS");
    }
});

module.exports = router;
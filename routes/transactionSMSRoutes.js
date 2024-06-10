const express = require('express')
const {addSMS} = require('../controller/transactionSMSController')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.post('/addSMS', async (req, res) => {
    try {
        const result = await addSMS(req, res);
        // res.status(200).json({"code":200,"message":"Successfully Add Business Entity"});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Unsuccessfully Transaction Added"});
    }
});

module.exports = router;

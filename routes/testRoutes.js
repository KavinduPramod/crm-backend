const express = require('express')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.post('/paymentCheck', async (req, res) => {
    console.log("Test Payment Check ")
});

module.exports = router;

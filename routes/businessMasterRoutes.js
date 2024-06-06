const express = require('express')
const {updateRequestSeller,checkSellerRequest} = require('../controller/businessMasterController')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.post('/requestSeller', async (req, res) => {
    try {
        const result = await updateRequestSeller(req, res);
        if (result == 0) {
            res.status(500).json({"code":500,"message":"Request Failed"});
        }
        res.status(200).json({ "code": 200, "message": 'Request Successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Something was wrong"});
    }
});


router.post('/checkSellerRequest', async (req, res) => {
    try {
        const result = await checkSellerRequest(req, res);
        if (result == 0) {
            res.status(500).json({"code":500,"message":"5"});
            return;
        }
        res.status(200).json({ "code": 200, "message": result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Something was wrong"});
    }
});

module.exports = router

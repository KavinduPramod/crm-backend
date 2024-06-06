const express = require('express')
const { getMMSProfile, getMMSServiceNumber, getSMSProfile, getWhatsAppProfile, getPlatform, getBusinessEntity, saveMessageSettings, saveSocialMedia,getPlatformName } = require('../controller/settingsController')
const { verifyUser } = require('../middleware/middleware')
const router = express.Router()

//Message Settings
router.get('/getMMSProfile', async (req, res) => {
    try {
        const result = await getMMSProfile(req, res);
        res.status(200).json({ "code": 200, "message": "Successfully  get MMSProfile", "data": result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Unsuccessfully get MMSProfile" });
    }
});

router.get('/getMMSServiceNumber', async (req, res) => {
    try {
        const result = await getMMSServiceNumber(req, res);
        res.status(200).json({ "code": 200, "message": "Successfully  get MMSServiceNumber", "data": result });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Unsuccessfully get MMSServiceNumber" });
    }
});

router.get('/getSMSProfile', async (req, res) => {
    try {
        const result = await getSMSProfile(req, res);
        res.status(200).json({ "code": 200, "message": "Successfully get SMSProfile", "data": result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Unsuccessfully get SMSProfile" });
    }
});

router.get('/getWhatsAppProfile', async (req, res) => {
    try {
        const result = await getWhatsAppProfile(req, res);
        res.status(200).json({ "code": 200, "message": "Successfully get WhatsAppProfile", "data": result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Unsuccessfully get WhatsAppProfile" });
    }
});

//Social Media
router.post('/getPlatform', async (req, res) => {
    try {
        const result = await getPlatform(req, res);
        res.status(200).json({ "code": 200, "message": "Successfully get Platform", "data": result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Unsuccessfully get Platform" });
    }
});

//Social Media
router.get('/getPlatformName', async (req, res) => {
    try {
        const result = await getPlatformName(req, res);
        res.status(200).json({ "code": 200, "message": "Successfully get Platform", "data": result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Unsuccessfully get Platform" });
    }
});

router.get('/getBusinessEntity', async (req, res) => {
    try {
        const result = await getBusinessEntity(req, res);
        res.status(200).json({ "code": 200, "message": "Successfully get BusinessEntity", "data": result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Unsuccessfully get BusinessEntity" });
    }
});

//save massage settings
router.post('/saveMassageSetting', async (req, res) => {
    try {
        const result = await saveMessageSettings(req, res);
        res.status(200).json({ "code": 200, "message": "Successfully save MassageSetting", "data": result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Unsuccessfully save MassageSetting" });
    }
});

//save social media settings
router.post('/saveSocialMedia', async (req, res) => {
    try {
        const result = await saveSocialMedia(req, res);
        res.status(200).json({ "code": 200, "message": "Successfully save SocialMedia", "data": result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Unsuccessfully save SocialMedia" });
    }
});

module.exports = router
const express = require('express')
const {addAccountType,addBusinessEntity,getBusinessEntity,getMobileNumbers,getAvailableNumber} = require('../controller/businessEntityController')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.post('/addAccountType', async (req, res) => {
    try {
        const result = await addAccountType(req, res);
        if (result == 0) {
            res.status(404).json({"code": 404, "message": "Something was wrong.Try Again."});
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Something was wrong"});
    }
});

// {
//     "it_business_eneity_master_id":value,
//     "entity_type":value,
//     "entity_name":value,
//     "entity_address":value,
//     "entity_state_province":value,
//     "zip_code":value,
//     "country_id":value,
//     "email":value,
//     "entity_phone":value,
//     "ref":value,
//     "status":value,
//     "c_at":value,
//     "c_by":value,
//     "m_at":value,
//     "m_by":value
// }
router.post('/addBusinessEntity', async (req, res) => {
    try {
        const result = await addBusinessEntity(req, res);
        res.status(200).json({"code":200,"message":"Successfully Add Business Entity"});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Unsuccessfully Add Business Entity"});
    }
});

router.post('/getBusinessEntity', async (req, res) => {
    try {
        const result = await getBusinessEntity(req, res);
        res.status(200).json({"code":200,"message":result});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Unsuccessfully Customer Added"});
    }
});

router.post('/getMobileNumbers', async (req, res) => {
    try {
        const result = await getMobileNumbers(req, res);
        res.status(200).json({"code":200,"message":result});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Unsuccessfully Customer Added"});
    }
});

router.post('/getAvailableNumber', async (req, res) => {
    try {
        const result = await getAvailableNumber(req, res);
        res.status(200).json({"code":200,"message":result});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Nothing to Available Number"});
    }
});

module.exports = router

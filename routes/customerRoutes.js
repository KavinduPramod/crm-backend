const express = require('express')
const {addCustomer,getCustomers,importCustomer} = require('../controller/customerEntityController')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

// {
//     "it_business_entity_id":value,
//     "first_name":value,
//     "last_name":value,
//     "phone_number":value,
//     "whatsapp":value,
//     "email":value,
//     "level":value,
//     "c_at":value,
//     "c_by":value,
//     "m_at":value,
//     "m_by":value
// }
router.post('/addCustomer', async (req, res) => {
    try {
        const result = await addCustomer(req, res);
        res.status(200).json({"code":200,"message":"Successfully Add Business Entity"});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Unsuccessfully Customer Added"});
    }
});

router.post('/importCustomer', async (req, res) => {
    try {
        const result = await importCustomer(req, res);
        res.status(200).json({"code":200,"message":"Successfully Add Business Entity"});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Unsuccessfully Customer Added"});
    }
});

router.post('/getCustomers', async (req, res) => {
    try {
        const result = await getCustomers(req, res);
                // Convert BigInt values to regular numbers
                const formattedResult = result.map(row => ({
                    entity_name: row.entity_name,
                    customer_count: Number(row.customer_count.toString())
                }));
        res.status(200).json({"code":200,"message":formattedResult});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({"code":500,"message":"Unsuccessfully Customer Added"});
    }
});

module.exports = router;

const express = require('express');
const {getSMSDetails,getMMSDetails,getResellerStatus} = require("../controller/homeController");
const router = express.Router();

//route to get MMS details
router.post('/getMMSDetails', async (req, res) => {
    try {
        const result = await getMMSDetails(req, res);
        if (result == 0) {
            res.status(404).json({"code": 404, "message": "MMS Not Found!."});
            return;
        }
        res.status(200).json({ "code": 200, "message": result });
    } 
    catch(error){
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
});


//route to get SMS details
router.post('/getSMSDetails', async (req, res) => {
    try {
        const result = await getSMSDetails(req, res);
        if (result == 0) {
            res.status(404).json({"code": 404, "message": "SMS Not Found!."});
            return;
        }
        res.status(200).json({ "code": 200, "message": result });
    } 
    catch(error){
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
});

// router.post("/getResellerStatus", async (req, res) => {
//     try{
//
//         const result = await getResellerStatus(req, res);
//         if (result == 0) {
//             res.status(404).json({"code": 404, "message": "Reseller Status Not Found!."});
//             return;
//         }
//         res.status(200).json({ "code": 200, "message": result });
//     }
//     catch(error){
//         console.error("Error:", error);
//         res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
//     }
// })

module.exports = router;
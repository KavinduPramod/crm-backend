const express = require('express')
const { find_User } = require('../controller/googleController')
const router = express.Router();

router.post('/find_User', async (req, res) => {
    try {
        const result = await find_User(req, res);
        if (result == 0) {
            res.status(404).json({ "code": 404, "message": "User Not Found!." });
            return;
        }
        res.status(200).json({ "code": 200, "message": result });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
});

module.exports = router;
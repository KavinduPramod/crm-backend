const { getConnection } = require('../config/db');

const addSMS = async (req,res) => {
    try {
        console.log(req.body)
        const connection = await getConnection();

    } catch (err) {
        throw new Error("Database query failed");
    }
}

module.exports = {addSMS};
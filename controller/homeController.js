const { getConnection } = require('../config/db');
const User = require('../models/User');

// to get MMS details FROM type = 0
const getMMSDetails = async (req,res) => {
    try{

        const connection = await getConnection();
        const getMMSDetailsQuery = `SELECT id,phone_number,text,status,sending_date,cost,it_business_master_id,type FROM transaction_sms WHERE it_business_master_id = ? AND type = 0`;
        const getMMSDetailsQueryResult = await connection.query(getMMSDetailsQuery,[
            req.body.it_business_master_id
        ]);
        console.log("MMS : Lahiru")
        console.log("it_business_master_id --) ",req.body.it_business_master_id);
        console.log("getMMSDetailsQueryResult ~~~>> ",getMMSDetailsQueryResult);
        if(getMMSDetailsQueryResult.length == 0){
            return 0;
        }
        return getMMSDetailsQueryResult;
    }
    catch(error){
        throw new Error("Database query failed");
    }
}

//to get SMS details type = 1
const getSMSDetails = async (req,res) => {
    try{

        const connection = await getConnection();
        const getSMSDetailsQuery = `SELECT media_link,text,schedule_date_and_time,campaign_type_id FROM campaign_master WHERE it_business_master_id = ?`;
        const getSMSDetailsQueryResult = await connection.query(getSMSDetailsQuery,[
            req.body.it_business_master_id
        ]); 
        console.log("it_business_master_id --) ",req.body.it_business_master_id);
        console.log("getSMSDetailsQueryResult ~~~>> ",getSMSDetailsQueryResult);
        if(getSMSDetailsQueryResult.length == 0){
            return 0;
        }
        return getSMSDetailsQueryResult;
    }
    catch(error){
        throw new Error("Database query failed");
    }
}

//to get reseller status
// const getResellerStatus = async (req, res) => {
//     try{
//         const connection = await getConnection();
//         const getResellerStatusQuery = `SELECT id,reseller_status FROM it_business_master WHERE it_business_master.id = ?`;
//         const getResellerStatusQueryResults = await connection.query(getResellerStatusQuery,[
//             req.body.it_business_master_id
//         ]);
//         console.log("getResellerStatusQueryResults ////// ",getResellerStatusQueryResults);
//
//         if(getResellerStatusQueryResults.length == 0){
//             return 0;
//         }
//         return getResellerStatusQueryResults;
//     }
//     catch(error){
//         console.log("Error occurred while getting SMS details ",error);
//         res.status(500).json({ "code": 500, "message": "Cannot fetch Reseller Status", "error": error.message });
//     }
// }


module.exports = {getSMSDetails,getMMSDetails};
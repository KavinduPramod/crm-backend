const { getConnection } = require("../config/db");

const updateRequestSeller = async (req, res) => {
  try {
    const userGroupID = req.body.user_group_id;
    console.log("GGGGG : "+userGroupID);
    const query = `UPDATE it_user_master SET reseller_status = 3 WHERE ref_temp_user_id = ?`;
    // const query_1 = `UPDATE it_user_temp SET status = 3 WHERE id = ?`;
    const connection = await getConnection();

    const result = await connection.query(query, [userGroupID]);
    // const result_1 = await connection.query(query_1, [userGroupID]);
    // if (result.affectedRows > 0 && result_1.affectedRows > 0) {
    if (result.affectedRows > 0) {
        return 1;
    } else {
        return 0;
    }
  } catch (err) {
      throw new Error("Database query failed");
  }
};

const checkSellerRequest  = async (req, res) => {
    try{
        const userGroupID = req.body.user_group_id;
        console.log(userGroupID);
        const connection = await getConnection();
        const query = `SELECT reseller_status FROM it_user_master WHERE ref_temp_user_id =?`;
        const result = await connection.query(query , [
            userGroupID
        ]);
        if (result.length == 0) {
            return 0;
        }
        console.log("result",result[0].reseller_status);
        return result[0].reseller_status;
    }
    catch(err) {
        throw new Error("Database query failed");
    }
}

module.exports = { updateRequestSeller,checkSellerRequest };

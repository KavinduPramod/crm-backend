const { getConnection } = require("../config/db");

const find_User = async (req, res) => { 
    try {
        const connection = await getConnection();
        console.log("google body", req.body);
        const get_user_query = `
        SELECT
            *
        FROM
            it_user_master
        WHERE
            it_user_master.email = ?`
        
        const get_user_query_result = await connection.query(get_user_query, [
            req.body.Google_Auth_email
        ]);
        console.log(get_user_query_result);
        if (get_user_query_result.length == 0) {
            return 0;
        }
        return get_user_query_result[0];
    } catch (error) {
        throw new Error("Can't find user");
    }
}

module.exports = { find_User };
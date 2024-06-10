const { getConnection } = require("../config/db");

const addAccountType = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction();
    let sql_find = "select * from it_user_temp where id=?";
    const result = await connection.query(sql_find, [req.body.id]);

    if (result.length == 0) {
      await connection.rollback();
      return res.status(404).send("User not found");
    }

    let sql_update = `UPDATE it_user_temp
                        SET business_type = ?, business_name = ?,business_phone=?
                        ,business_email=?,business_address=?,state_province=?,zip_code=?,it_country_id=?
                        WHERE id=?`;
    console.log(req.body);
    const result_update = await connection.query(sql_update, [
      req.body.business_type,
      req.body.business_name,
      req.body.business_phone,
      req.body.business_email,
      req.body.business_address,
      req.body.state_province,
      req.body.zip_code,
      req.body.it_country_id,
      req.body.id,
    ]);

    if (result_update.affectedRows == 0) {
      await connection.rollback();
      return res.status(500).send("Failed to update user");
    }

    const result_search = await connection.query(sql_find, [req.body.id]);
    console.log("it_business_master >>> ", result_search);

    const queryIBM = `insert into it_business_master(
                        business_type, name, address, state_province,
                        zip_code, it_country_id, business_email, business_email_verified,
                        business_phone, business_phone_verified, sms_mask, swift_code,
                        mms_profile_id, sms_profile_id, whatsapp_profile_id, social_media_profile_id,
                        status, c_at, c_by, m_at, m_by
                        ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const resItBusinessMaster = await connection.query(queryIBM, [
      result_search[0].business_type,
      result_search[0].name,
      result_search[0].address,
      result_search[0].state_province,
      result_search[0].zip_code,
      result_search[0].it_country_id,
      result_search[0].business_email,
      result_search[0].business_email_verified,
      result_search[0].business_phone,
      result_search[0].business_phone_verified,
      "",
      "",
      0,
      0,
      0,
      0,
      0,
      req.body.c_at,
      0,
      req.body.m_at,
      0
    ]);
    console.log("DATA INSERT INTO it_business_master");

    if (resItBusinessMaster.affectedRows == 0) {
      await connection.rollback();
      return res.status(500).send("Failed to insert into it_business_master");
    }
    // Get the ID of the inserted record
    const itBusinessMasterInsertedId = resItBusinessMaster.insertId;
    console.log("Business Master ID  : Lahiru : ",itBusinessMasterInsertedId)
    // const truncatedUserName = result_search[0].user_name.substring(0, 10); // Replace maxLength with the maximum allowed length

    const queryIUM = `insert into it_user_master(
                        user_group_id,it_business_master_id,name,phone,phone_verified,email,email_verified,
                        user_name,password,password_old1,password_old2,ref_number,ref_temp_user_id,status,c_at,c_by,m_at,m_by,reseller_status
                        ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const resItUserMaster = await connection.query(queryIUM, [
      1,
      itBusinessMasterInsertedId,
      result_search[0].name,
      result_search[0].phone,
      result_search[0].phone_verified,
      result_search[0].email,
      result_search[0].email_verified,
      result_search[0].name,
      result_search[0].password,
      result_search[0].password_old1,
      result_search[0].password_old2,
      "",
      result_search[0].id,
      result_search[0].state,
      req.body.c_at,
      0,
      req.body.m_at,
      0,
      1
    ]);
    console.log("DATA INSERT INTO it_user_master");

    if (resItUserMaster.affectedRows == 0) {
      // Rollback transaction if insert fails
      await connection.rollback();
      return res.status(500).send("Failed to insert into it_user_master");
    }

    //insert it_business master id in it_user-temp table as well.
    const itBusinessMasterInsetQuery = 'UPDATE it_user_temp SET it_business_master_id = ? WHERE id= ?';
    const itBusinessMasterInsetQueryData = await connection.query(itBusinessMasterInsetQuery, [
      resItBusinessMaster.insertId,
      req.body.id,
    ]);

    if (itBusinessMasterInsetQueryData.affectedRows == 0) {
      // Rollback transaction if insert fails
      await connection.rollback();
      return res.status(500).send("Failed to insert it_business_master_id into it_user_temp");
    }

    // Commit transaction if all queries are successfull
    await connection.commit();

       // Create an object containing both results
  const responseData = {
      result_search: result_search,
      itBusinessMasterInsertedId: resItBusinessMaster.insertId.toString(),
  };

    console.log("User data inserted successfully");
    res.status(200).send(responseData);
    console.log("Whole table values => ", responseData);
    // return itBusinessMasterInsertedId;
  } catch (err) {
    // Rollback transaction if any error occurs
    if (connection) {
      await connection.rollback();
    }
    throw new Error("Database query failed");
  }
};

const addBusinessEntity = async (req, res) => {
  try {
    console.log(req.body);
    const connection = await getConnection();
    await connection.beginTransaction();

    const query = `insert into it_business_entity(
                        it_business_master_id,
                        entity_type,entity_name,entity_address,
                        entity_state_province,zip_code,country_id,
                        email,entity_phone,ref,status,
                        c_at,c_by,m_at,m_by,
                        sending_phone_number
                        ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await connection.query(query, [
      req.body.it_business_master_id,
      req.body.entity_type,
      req.body.entity_name,
      req.body.entity_address,
      req.body.entity_state_province, 
      req.body.zip_code,
      req.body.country_id,
      req.body.email,
      req.body.entity_phone,
      req.body.ref,
      req.body.status,
      req.body.c_at,
      0,
      req.body.m_at,
      0,
      req.body.sending_phone_number,
    ]);

    if(result.affectedRows == 0){
      await connection.rollback();
      return res.status(500).send("Failed to insert into it_business_entity");
    }

    const insertedId = Number(result.insertId);
    const query_1 = `insert into gateway_numbers_details(
                        gateway_id,status,business_entity_id,c_at,c_by,m_at,m_by
                        ) values(?,?,?,?,?,?,?)`;
    const result_1 = await connection.query(query_1, [
          req.body.select_number,0,insertedId,req.body.c_at,0,req.body.m_at, 0
    ]);

    if(result_1.affectedRows == 0){
      await connection.rollback();
      return res.status(500).send("Failed to insert into it_business_entity");
    }

    await connection.commit();
    return true;
  } catch (err) {
      throw new Error("Database query failed");
  }
};

const getBusinessEntity = async (req, res) => {
  try {
    const connection = await getConnection();
    const query = `select id,entity_name as name from it_business_entity WHERE it_business_master_id=?`;
    const result = await connection.query(query, [req.body.business_master_id]);
    return result;
  } catch (err) {
      throw new Error("Database query failed");
  }
};

const getMobileNumbers = async (req, res) => {
  try {
    const branchIds = req.body.branchIds;
    // Prepare SQL query with placeholders for branch IDs
    const query = `SELECT phone_number FROM customer_master WHERE it_business_entity_id IN (?)`;
    const connection = await getConnection();
    // Execute the query with branch IDs as parameters
    const result = await connection.query(query, [branchIds]);
    
    // Extract phone numbers from the result
    const phoneNumbers = result.map(row => row.phone_number);
    
    return phoneNumbers;
  } catch (err) {
      throw new Error("Database query failed");
  }
};

/**
 * Message Send API Buy Telephone Number
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const getAvailableNumber = async (req, res) => {
    try {
      console.log("Get Available Number")
        const connection = await getConnection();
        const query = `SELECT gateway_numbers.id,gateway_numbers.message_number
                        FROM gateway_numbers
                        LEFT JOIN gateway_numbers_details ON gateway_numbers_details.gateway_id = gateway_numbers.id
                        WHERE gateway_numbers.status = 1
                        AND gateway_numbers_details.gateway_id IS NULL`;
        const result = await connection.query(query);
        return result;
    } catch (err) {
        throw new Error("Database query failed");
    }
};

module.exports = { addAccountType, addBusinessEntity, getBusinessEntity, getMobileNumbers,getAvailableNumber };
